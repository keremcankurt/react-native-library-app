import { del, get, post, put } from '../request';


const BASE_URL: string ="http://ec2-16-171-159-119.eu-north-1.compute.amazonaws.com:5000/api/book"


const getAllBooks = () => get(`${BASE_URL}`);
const deleteBook = (data: {userId: string, bookId: string}) => del(`${BASE_URL}/delete/${data.userId}/${data.bookId}`, null, "application/json");
const addBook = (data: any, id: string) => post(`${BASE_URL}/add/${id}`, data,'application/json');
const updateBook = (data: any, userId: string, bookId: string) => put(`${BASE_URL}/update/${userId}/${bookId}`, data,'application/json');


const authService = {
    getAllBooks,
    deleteBook,
    addBook,
    updateBook
};

export default authService;
