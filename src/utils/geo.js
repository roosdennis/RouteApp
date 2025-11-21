// Earth radius in meters
const R = 6371e3;

/**
 * Converts degrees to radians
 */
const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Converts radians to degrees
 */
const toDeg = (rad) => (rad * 180) / Math.PI;

/**
 * Calculates distance between two points in meters using Haversine formula
 * @param {Object} p1 - {lat, lon}
 * @param {Object} p2 - {lat, lon}
 * @returns {number} Distance in meters
 */
export const calculateDistance = (p1, p2) => {
    const φ1 = toRad(p1.lat);
    const φ2 = toRad(p2.lat);
    const Δφ = toRad(p2.lat - p1.lat);
    const Δλ = toRad(p2.lon - p1.lon);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Calculates bearing (direction) from p1 to p2 in degrees (0-360)
 * @param {Object} p1 - {lat, lon}
 * @param {Object} p2 - {lat, lon}
 * @returns {number} Bearing in degrees
 */
export const calculateBearing = (p1, p2) => {
    const φ1 = toRad(p1.lat);
    const φ2 = toRad(p2.lat);
    const Δλ = toRad(p2.lon - p1.lon);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (toDeg(θ) + 360) % 360;
};

/**
 * Perpendicular distance from a point to a line segment
 */
const perpendicularDistance = (point, lineStart, lineEnd) => {
    let x = point.lon;
    let y = point.lat;
    let startX = lineStart.lon;
    let startY = lineStart.lat;
    let endX = lineEnd.lon;
    let endY = lineEnd.lat;

    let slope = (endY - startY) / (endX - startX);
    let intercept = startY - slope * startX;

    // Handle vertical lines
    if (!isFinite(slope)) {
        return Math.abs(x - startX);
    }

    let result = Math.abs(slope * x - y + intercept) / Math.sqrt(slope * slope + 1);

    // Approximate conversion to meters (very rough, but sufficient for relative comparison in RDP)
    // For better accuracy, we should project to meters first, but this is usually fine for small areas.
    // Let's use a simple degree-to-meter factor for latitude to scale it roughly.
    return result * 111139;
};

/**
 * Ramer-Douglas-Peucker simplification algorithm
 * @param {Array} points - Array of {lat, lon}
 * @param {number} epsilon - Tolerance in meters
 * @returns {Array} Simplified array of points
 */
export const simplifyTrack = (points, epsilon) => {
    if (points.length < 3) return points;

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = perpendicularDistance(points[i], points[0], points[end]);
        if (d > dmax) {
            index = i;
            dmax = d;
        }
    }

    if (dmax > epsilon) {
        const recResults1 = simplifyTrack(points.slice(0, index + 1), epsilon);
        const recResults2 = simplifyTrack(points.slice(index, end + 1), epsilon);

        return [...recResults1.slice(0, recResults1.length - 1), ...recResults2];
    } else {
        return [points[0], points[end]];
    }
};

/**
 * Filter points that are too close to each other to reduce jitter
 */
export const filterJitter = (points, minDistance) => {
    if (points.length === 0) return [];

    const result = [points[0]];
    let lastPoint = points[0];

    for (let i = 1; i < points.length; i++) {
        const dist = calculateDistance(lastPoint, points[i]);
        if (dist >= minDistance) {
            result.push(points[i]);
            lastPoint = points[i];
        }
    }
    return result;
};

/**
 * Detects turns based on bearing changes
 * @param {Array} points - Simplified track points
 * @returns {Array} Instructions
 */
export const detectTurns = (points) => {
    const instructions = [];
    let totalDistance = 0;
    let lastInstructionDist = 0;

    // Start with the first point
    // We need at least 3 points to detect a turn (A -> B -> C)
    for (let i = 1; i < points.length - 1; i++) {
        const pPrev = points[i - 1];
        const pCurr = points[i];
        const pNext = points[i + 1];

        const dist = calculateDistance(pPrev, pCurr);
        totalDistance += dist;

        const bearingIn = calculateBearing(pPrev, pCurr);
        const bearingOut = calculateBearing(pCurr, pNext);

        let deltaAngle = bearingOut - bearingIn;

        // Normalize to -180 to 180
        while (deltaAngle <= -180) deltaAngle += 360;
        while (deltaAngle > 180) deltaAngle -= 360;

        // Thresholds
        const absAngle = Math.abs(deltaAngle);

        // Turn detection logic
        // > 30 degrees is a turn
        // < 150 degrees (avoid U-turns/noise unless explicit)
        if (absAngle > 30 && absAngle < 150) {
            const interval = totalDistance - lastInstructionDist;

            // Grouping logic: if very close to previous turn (< 50m), might be a complex junction
            // For MVP, we just list them.

            let type = 'Straight';
            if (deltaAngle > 45) type = 'Right';
            else if (deltaAngle > 10) type = 'Slight Right';
            else if (deltaAngle < -45) type = 'Left';
            else if (deltaAngle < -10) type = 'Slight Left';

            instructions.push({
                id: i,
                point: pCurr,
                totalDistance: Math.round(totalDistance), // meters
                interval: Math.round(interval), // meters
                angle: deltaAngle,
                bearingIn,
                bearingOut,
                text: type,
            });

            lastInstructionDist = totalDistance;
        }
    }

    return instructions;
};
