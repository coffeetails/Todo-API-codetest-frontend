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
baseURL: 'http://localhost:9090',
withCredentials: true,
headers: {Authorization: `Bearer ${authService.getToken()}`},
});

export const taskService = {

    addTodo:  async (newTodo) => {
        axiosInstance.post('/api/todo', 
            newTodo
        )
        .then(function (response) {
            console.log(response);
            return newTodo;
        })
        .catch(function (error) {
            console.log(error.response.data);
            console.log(error);
        });
    },

}