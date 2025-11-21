import { gpx } from '@mapbox/togeojson';

export const parseGPX = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
                const geoJSON = gpx(xmlDoc);

                // Extract coordinates from the first feature (usually a LineString)
                // geoJSON.features[0].geometry.coordinates is [lon, lat, ele]

                const track = geoJSON.features.flatMap(feature => {
                    if (feature.geometry.type === 'LineString') {
                        return feature.geometry.coordinates.map(coord => ({
                            lon: coord[0],
                            lat: coord[1],
                            ele: coord[2] || 0,
                            time: null // togeojson might put time in properties, ignoring for now
                        }));
                    } else if (feature.geometry.type === 'MultiLineString') {
                        return feature.geometry.coordinates.flat().map(coord => ({
                            lon: coord[0],
                            lat: coord[1],
                            ele: coord[2] || 0
                        }));
                    }
                    return [];
                });

                resolve(track);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
    });
};
