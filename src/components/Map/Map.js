import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import mapboxgl from "mapbox-gl";
import axios from "axios";

mapboxgl.accessToken = "pk.eyJ1IjoiYW5nbGljemFuaW4iLCJhIjoiY2tyemJuaGV5MHB6YTJubzlyeDg2ZTlreiJ9.jnutTHEQiqXHk77kPAizfg";

const MapboxGLMap = ({ canSetRoute = true, event = null, setEvent = null }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const routeCoords = event.route ? routeToCoords(event.route) : null;

    useEffect(() => {
        if (map.current) {
            return;
        }
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: event.route ? [(routeCoords[routeCoords.length - 1][0] + routeCoords[0][0]) / 2, (routeCoords[routeCoords.length - 1][1] + routeCoords[0][1]) / 2]
                : [19.562303295747288, 51.835757715694405],
            zoom: event.route ? 12 : 6
        });
    });

    useEffect(() => {

        const drawNewRoute = (coords) => {
            map.current.addLayer({
                id: "route",
                type: "line",
                source: {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: coords,
                        },
                    },
                },
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#3887be",
                    "line-width": 5,
                    "line-opacity": 0.75,
                },
            });
        }

        const drawRoute = async (coords) => {
            if (coords.length < 2) {
                return;
            }
            const coordString = coords.join(";");
            const URL = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordString}`;
            const { data } = await axios.get(URL, {
                params: {
                    geometries: "geojson",
                    access_token: mapboxgl.accessToken,
                },
            });
            if (map.current.getSource("route")) {
                map.current.removeLayer("route");
                map.current.removeSource("route");
                drawNewRoute(data.routes[0].geometry.coordinates);
            } else {
                drawNewRoute(data.routes[0].geometry.coordinates);
            }
            return coordsToRoute(data.routes[0].geometry.coordinates);
        };

        if (!map.current) {
            return;
        }

        if (event.route) {
            map.current.on('load', () => {
                if (!map.current.getSource("route")) {
                    drawNewRoute(routeCoords);
                }
            });
        }

        if (!canSetRoute) {
            return;
        }

        let timerId = null;
        const markersArray = [];
        map.current.on('click', (e) => {
            if (timerId) {
                clearTimeout(timerId);
            }
            const marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map.current);
            markersArray.push(marker);

            timerId = setTimeout(async () => {
                const coords = [];
                for (const marker of markersArray) {
                    const { lng, lat } = marker.getLngLat();
                    coords.push([lng, lat]);
                    marker.remove();
                }
                markersArray.splice(0, markersArray.length);
                const route = await drawRoute(coords);
                setEvent({ ...event, route: route });
            }, 2000);

        });
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

const routeToCoords = (route) => {
    const coords = [];
    route.forEach(element => {
        coords.push([element.coords.longitude, element.coords.latitude]);
    });
    return coords;
}

const coordsToRoute = (coords) => {
    const route = [];
    coords.forEach(element => {
        route.push({
            timestamp: 0,
            coords: {
                latitude: element[1],
                longitude: element[0],
                altitude: 0,
                accuracy: 0,
                heading: 0,
                speed: 0
            }
        })
    });
    return route;
}

export default MapboxGLMap;