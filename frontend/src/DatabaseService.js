import axios from 'axios';

require('dotenv').config({path: '/.env'});

const API_URL = process.env.REACT_APP_API_URL

export default class DatabaseService{


    getDataNames(dataType) {
        const url = `${API_URL}/api/getDataNames/${dataType}`;
        return axios.get(url).then(response => response.data);
    }

    getData(dataType, dataName) {
        const url = `${API_URL}/api/getData/${dataType}/${dataName}`;
        return axios.get(url).then(response => response.data);
    }
}