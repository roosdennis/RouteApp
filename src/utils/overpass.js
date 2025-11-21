import { calculateBearing, calculateDistance } from './geo';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Fetches intersection data for a list of instructions.
 * Uses a batch query to minimize requests.
 * @param {Array} instructions - List of turn instructions
 * @returns {Promise<Array>} - Instructions enriched with 'branches' (array of relative angles)
 */
export const fetchIntersections = async (instructions) => {
    if (!instructions || instructions.length === 0) return [];

    // We'll process in chunks to avoid massive queries (e.g., 10 at a time)
    const CHUNK_SIZE = 10;
    const enrichedInstructions = [...instructions];

    for (let i = 0; i < instructions.length; i += CHUNK_SIZE) {
        const chunk = instructions.slice(i, i + CHUNK_SIZE);
        try {
            const updates = await processChunk(chunk);
            // Merge updates back
            updates.forEach(update => {
                const idx = enrichedInstructions.findIndex(inst => inst.id === update.id);
                if (idx !== -1) {
                    enrichedInstructions[idx] = { ...enrichedInstructions[idx], branches: update.branches };
                }
            });
        } catch (err) {
            console.error("Failed to fetch intersections for chunk", i, err);
            // Continue with other chunks even if one fails
        }
    }

    return enrichedInstructions;
};

const processChunk = async (instructions) => {
    // Build Overpass Query
    // We want ways around each point.
    // query: [out:json]; ( way(around:20, lat, lon)[highway]; >; ); out body;

    let query = '[out:json];(';
    instructions.forEach(inst => {
        const { lat, lon } = inst.point;
        // Filter for relevant highways (exclude footways if we are driving? Assuming hiking/scouting so include paths)
        query += `way(around:25,${lat},${lon})["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|track|path|cycleway|footway)$"];`;
    });
    query += ');out body;';

    const response = await fetch(OVERPASS_API, {
        method: 'POST',
        body: query
    });

    if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);

    const data = await response.json();

    // Parse Data
    const nodes = new Map();
    const ways = [];

    data.elements.forEach(el => {
        if (el.type === 'node') {
            nodes.set(el.id, { lat: el.lat, lon: el.lon });
        } else if (el.type === 'way') {
            ways.push(el);
        }
    });

    // For each instruction, find the topology
    return instructions.map(inst => {
        const center = inst.point;

        // 1. Find the OSM node closest to our instruction point
        // We only consider nodes that are part of the fetched ways
        let closestNodeId = null;
        let minDist = Infinity;

        // Get all node IDs used in the fetched ways
        const relevantNodeIds = new Set(ways.flatMap(w => w.nodes));

        relevantNodeIds.forEach(nodeId => {
            const node = nodes.get(nodeId);
            if (node) {
                const dist = calculateDistance(center, node);
                if (dist < 30 && dist < minDist) { // 30m threshold
                    minDist = dist;
                    closestNodeId = nodeId;
                }
            }
        });

        if (!closestNodeId) {
            return { id: inst.id, branches: [] };
        }

        // 2. Find all ways connected to this node
        const connectedWays = ways.filter(w => w.nodes.includes(closestNodeId));

        // 3. Calculate bearing of each arm
        const branches = [];
        const centerNode = nodes.get(closestNodeId);

        connectedWays.forEach(way => {
            const idx = way.nodes.indexOf(closestNodeId);

            // Check previous node
            if (idx > 0) {
                const prevNode = nodes.get(way.nodes[idx - 1]);
                branches.push(calculateBearing(centerNode, prevNode));
            }

            // Check next node
            if (idx < way.nodes.length - 1) {
                const nextNode = nodes.get(way.nodes[idx + 1]);
                branches.push(calculateBearing(centerNode, nextNode));
            }
        });

        // 4. Normalize angles relative to bearingIn
        // We want 0 to be "Straight Ahead", 180 to be "Back"
        // branchAngle = roadBearing - bearingIn

        const relativeBranches = branches.map(bearing => {
            let rel = bearing - inst.bearingIn;
            while (rel <= -180) rel += 360;
            while (rel > 180) rel -= 360;
            return rel;
        });

        // Filter out duplicates (some ways might be split or very close angles)
        const uniqueBranches = relativeBranches.filter((angle, index, self) => {
            return self.findIndex(a => Math.abs(a - angle) < 10) === index;
        });

        return { id: inst.id, branches: uniqueBranches };
    });
};
