// Funzione per calcolare le coordinate del centro di un poligono
export const getPolygonCentroid = (vertices) => {
    let xSum = 0, ySum = 0, area = 0;
    let n = vertices.length;

    for (let i = 0; i < n; i++) {
        let x0 = vertices[i][0];
        let y0 = vertices[i][1];
        let x1 = vertices[(i + 1) % n][0];
        let y1 = vertices[(i + 1) % n][1];

        let a = x0 * y1 - x1 * y0;
        area += a;
        xSum += (x0 + x1) * a;
        ySum += (y0 + y1) * a;
    }

    area *= 0.5;
    let centroidX = xSum / (6 * area);
    let centroidY = ySum / (6 * area);
    return [centroidX, centroidY];
}

export const drawAreas = (geojson, leafletElement) => {
    let drawnItems = new L.FeatureGroup();
    let geoJsonGroup = L.geoJson(geojson).addTo(leafletElement);
    drawnItems.addLayer(geoJsonGroup);
    return geoJsonGroup._leaflet_id
}
