import axios from 'axios';

require('dotenv').config({path: '/.env'});

const API_URL = process.env.REACT_APP_API_URL

export default class DatabaseService{

    // constructor(){}

    getCustomers() {
        require('dotenv').config()
        const url = `${API_URL}/api/customers/`;
        return axios.get(url).then(response => response.data);
    }

    getVacancyCities() {

        const url = `${API_URL}/api/vacancy/cities`;
        return axios.get(url).then(response => response.data);
    }

    getVacancyData(city) {
        const url = `${API_URL}/api/vacancy/${city}`;
        return axios.get(url).then(response => response.data);
    }
}