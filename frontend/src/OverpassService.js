import axios from 'axios';
const parseGeoraster = require("georaster");
const maxPointsSize = 40000;
const maxPathsSize = 200000

export default class OverpassService {
    constructor() {
        this.overpassUrl = "https://overpass-api.de/api/interpreter?";
    }

    getLatLngString = (bounds) => {
        return bounds._southWest.lat.toFixed(4) + "," + bounds._southWest.lng.toFixed(4) +
         "," + bounds._northEast.lat.toFixed(4) + "," + bounds._northEast.lng.toFixed(4);
    }

    getMountains = (bounds, minElevation) => {
        let latLngString = this.getLatLngString(bounds);
        let nQuery = "node[natural=peak]" + "(" + latLngString + ")(if:t[\"ele\"]>" + minElevation + ");";
        let overpass_query = "data=[out:json][maxsize:" + maxPointsSize + "];" + nQuery + "out;";
        const url = this.overpassUrl + overpass_query;
        return axios.get(url).then(response => response.data);
    }

    getVolcanoes = (bounds, minElevation) => {
        let latLngString = this.getLatLngString(bounds);
        if (minElevation > 0) {
            var nQuery = "node[natural=volcano]" + "(" + latLngString + ")(if:t[\"ele\"]>" + minElevation + ");";
        } else {
            var nQuery = "node[natural=volcano]" + "(" + latLngString + ");";
        }
        let overpass_query = "data=[out:json][maxsize:" + maxPointsSize + "];" + nQuery + "out;";
        const url = this.overpassUrl + overpass_query;
        return axios.get(url).then(response => response.data);
    }

    getHikingPaths = (bounds, sacScale) => {
        let latLngString = this.getLatLngString(bounds);
        var wQuery = "(";

        let firstQuery = true;
        Object.keys(sacScale).map((key, index) => {
            if (key != "no_sac_scale" && sacScale[key].show){
                if (firstQuery) {
                    wQuery += "way[highway=path][\"sac_scale\"~\"";
                } else {
                    wQuery += "|";
                }
                firstQuery = false;
                wQuery += "^" + key + "$";
            }
        })

        if (!firstQuery) {
            wQuery += "\"]" + "(" + latLngString + ");";
        }

        // Get hiking paths without a SAC scale specified
        if (sacScale["no_sac_scale"].show) {
            wQuery += "way[highway=path][!sac_scale](" + latLngString + ");";
        }
        
        var nQuery = ");node(w)" + "(" + latLngString + ");";
        let overpass_query = "data=[out:json][maxsize:" + maxPathsSize + "];(" + wQuery + nQuery + ");out;";
        const url = this.overpassUrl + overpass_query;
        return axios.get(url).then(response => response.data);
    }

    getBikePaths = (bounds, showBikePaths) => {
        let wQuery = "(";
        let latLngString = this.getLatLngString(bounds);
        if (showBikePaths.Cycle.show){
            wQuery += "way[\"highway\"~\"path|track|cycleway\"][\"bicycle\"~\"yes|dedicated\"](" 
                + latLngString + ");";
            wQuery += "way[\"highway\"~\"cycleway\"](" + latLngString + ");";
            wQuery += "way[\"cycleway\"](" + latLngString + ");";
        }
        if (showBikePaths.MTB.show) {
            wQuery += "way[\"mtb:scale\"](" + latLngString + ");";
            wQuery += "way[\"mtb:scale:imba\"](" + latLngString + ");";
            wQuery += "way[\"mtb:type\"](" + latLngString + ");";
        }
        wQuery += ");"

        let nQuery = "node(w)" + "(" + latLngString + ");";
        let overpass_query = "data=[out:json][maxsize:" + maxPathsSize + "];(" + wQuery + nQuery + ");out;";
        const url = this.overpassUrl + overpass_query;
        return axios.get(url).then(response => response.data);
    }

    // getMTBRoutes = (bounds) => {
    //     let latLngString = this.getLatLngString(bounds);
    //     let wQuery = "(way[\"mtb:scale\"](" + latLngString + ");";
    //     wQuery += "way[\"mtb:scale:imba\"](" + latLngString + ");";
    //     wQuery += "way[\"mtb:type\"](" + latLngString + "););";

    //     var nQuery = "node(w)" + "(" + latLngString + ");";
    //     let overpass_query = "data=[out:json][maxsize:" + maxPathsSize + "];(" + wQuery + nQuery + ");out;";
    //     const url = this.overpassUrl + overpass_query;
    //     return axios.get(url).then(response => response.data);
    // }

    getElevation = (latlng, zoom) => {
        if (zoom > 14) {
            zoom = 14;
        }
        let x = (latlng.lng + 180) / 360 * Math.pow(2, zoom);
        let x_tile = Math.floor(x);
        let x_px = Math.round((x - x_tile) * 512);

        let y = (1 - Math.log(Math.tan(latlng.lat * Math.PI / 180) +
         1 / Math.cos(latlng.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
        let y_tile = Math.floor(y);
        var y_px = Math.round((y - y_tile) * 512);

        const url = "https://s3.amazonaws.com/elevation-tiles-prod/geotiff/" + zoom + "/" 
            + x_tile + "/" + y_tile + ".tif";

        return fetch(url).then(response => response.arrayBuffer()).then(parseGeoraster).then(georaster => {
            // console.log("georaster:", georaster);
            // console.log("elevation:", georaster.values[0][x_px][y_px]);
            return georaster.values[0][y_px][x_px].toFixed(1);

        })
    }
}