import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-b530e.firebaseio.com/'
})

export default instance;