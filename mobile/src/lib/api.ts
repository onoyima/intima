import axios from 'axios';
import { Platform } from 'react-native';

// Replace with your machine's IP address if running on a physical device
// You can find your IP by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
const BASE_URL = 'http://135.129.124.12:5000';


const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export default api;
