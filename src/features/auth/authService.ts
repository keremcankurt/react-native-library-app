import { get, post, put } from '../request';

const BASE_URL: string ="http://ec2-16-171-159-119.eu-north-1.compute.amazonaws.com:5000/api/auth"
const login = (data: any) => post(`${BASE_URL}/login`, data, 'application/json');
const register = (data: any) => post(`${BASE_URL}/register`, data, 'application/json');

const authService = {
    login,
    register,
};

export default authService;
