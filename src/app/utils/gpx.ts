import { gpx } from '@mapbox/togeojson';
import { Point } from './geo';

export const parseGPX = async (file: File): Promise<Point[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target?.result as string, "text/xml");
                const geoJSON = gpx(xmlDoc);

                // Extract coordinates from the first feature (usually a LineString)
                // geoJSON.features[0].geometry.coordinates is [lon, lat, ele]

                const track: Point[] = geoJSON.features.flatMap((feature: any) => {
                    if (feature.geometry.type === 'LineString') {
                        return feature.geometry.coordinates.map((coord: number[]) => ({
                            lon: coord[0],
                            lat: coord[1],
                            ele: coord[2] || 0,
                            time: null // togeojson might put time in properties, ignoring for now
                        }));
                    } else if (feature.geometry.type === 'MultiLineString') {
                        return feature.geometry.coordinates.flat().map((coord: number[]) => ({
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
