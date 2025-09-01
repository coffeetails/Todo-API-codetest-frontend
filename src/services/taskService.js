import { authService } from "./authService";
import axios from "axios";

// TODO: implement taskService and call the API

// ENDPOINTS Todo
// GET      /api/todo           get all todos
// GET      /{id}               get todo by id
// POST     /api/todo           create new todo
// PUT      /{id}               update todo by id
// DELETE   /{id}               delete todo by id
// GET      /person/{personId}  get todos by person id
// GET      /status             get todos by status
// GET      /overdue            get todos by overdue

const axiosInstance = axios.create({
baseURL: 'http://localhost:9090/api/todo',
withCredentials: true,
});

export const taskService = {

    addTodo: async function addTodo(newTodo) {
        try {
            const response = await axiosInstance.post('', 
                newTodo, 
                { headers: { Authorization: `Bearer ${authService.getToken()}` } }
            );
            console.log(response);
            return newTodo.data;

        } catch (error) {
            console.log(error.response.data);
            console.log(error);
        }
    },

    getTodos: async function getTodos() {
        try {
            const response = await axiosInstance.get(
                '',
                { headers: { Authorization: `Bearer ${authService.getToken()}` } }
            );
            console.log(response);
            return response.data;

        } catch (error) {
            console.log(error.response.data);
            console.log(error);
        }
    },
    
}