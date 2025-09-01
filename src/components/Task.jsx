import { useEffect, useState } from 'react'
import './Task.css';
import Sidebar from './Sidebar';
import Header from "./Header.jsx";
import { taskService } from '../services/taskService.js';
// import axios from "axios";
// import { authService } from '../services/authService.js';

// TODO: make this component functional by implementing state management and API calls
const Task = () => {
  const [todos, setTodos] = useState([]);
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    setNewTodos();
  },[]);

  async function setNewTodos() {
    try {
      const logTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
      const todos = await taskService.getTodos()
      console.log( logTime," taskService.getTodos", todos);
      if (Array.isArray(todos)) {  // Ensure data is an array
        setTodos(todos);
      } else {
        console.error('Expected an array but got:', todos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const addTodo = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const attachmentsInput = event.currentTarget.elements.todoAttachments;
    //const personInput = event.currentTarget.elements.todoPerson[data.get('todoPerson')].label;

    await taskService.addTodo({
      "id": 0,
      "title": data.get('todoTitle').length != 0 ? data.get('todoTitle') : 'Todo',
      "description": data.get('todoDescription') ?? '',
      "completed": false,
      "createdAt": new Date().toISOString(),
      "updatedAt": null,
      "dueDate": data.get('todoDueDate').length != 0  ? data.get('todoDueDate') : 'anytime',
      "personId": data.get('todoPerson') != 0 ? data.get('todoPerson') : '0', // TODO: Get their actual id
      "numberOfAttachments": attachmentsInput.files.length ?? '0',
    });

    //setTodos(prev => [newTodo, ...prev]);
    setNewTodos();
  }


  const displayTodoItems = todos.map((todo, index) => {
    return (
      <div className="list-group-item list-group-item-action" key={index}>
        <div className="d-flex w-100 justify-content-between align-items-start">
          <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <h6 className="mb-1">{todo.title}</h6>
                <small className="text-muted ms-2">Created: {todo.createdAt}</small>
              </div>
              <p className="mb-1 text-muted small">{todo.description}</p>
              <div className="d-flex align-items-center flex-wrap">
              <small className="text-muted me-2"> <i className="bi bi-calendar-event"></i> Due: {todo.dueDate}</small>
              <span className="badge bg-info me-2"> <i className="bi bi-person"></i> {/* TODO: person id → name */} {todo.personId}</span>
              <span className="badge bg-warning text-dark me-2">{/* TODO: add status logic 'pending' → 'completed' */}status</span>
            </div>
          </div>
          <div className="btn-group ms-3">
            <button className="btn btn-outline-success btn-sm" title="Complete">  <i className="bi bi-check-lg"></i> </button> {/* TODO: add button functionality */}
            <button className="btn btn-outline-primary btn-sm" title="Edit"> <i className="bi bi-pencil"></i> </button> {/* TODO: add button functionality */}
            <button className="btn btn-outline-danger btn-sm" title="Delete"> <i className="bi bi-trash"></i> </button> {/* TODO: add button functionality */}
          </div>
        </div>
      </div>
    );
  });

  const attatchmentUpdate = (event) => {
    const attachmentsInput = Array.from(event.target.files);
    setFiles(attachmentsInput);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {} } /> {/* TODO: add sidebar hide/show functionality */}
      <main className="dashboard-main">
        <Header title="Tasks" subtitle="Manage and organize your tasks" onToggleSidebar={() => {}} />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm task-form-section"> {/* add new task */}
                <div className="card-body">
                  <h2 className="card-title mb-4">Add New Task</h2>
                  <form id="todoForm" onSubmit={addTodo} >
                    <div className="mb-3"> {/* title */}
                      <label htmlFor="todoTitle" className="form-label">Title</label>
                      <input type="text" name="todoTitle" className="form-control" id="todoTitle" required />
                    </div>

                    <div className="mb-3"> {/* desc */}
                      <label htmlFor="todoDescription" className="form-label">Description</label>
                      <textarea className="form-control" name="todoDescription" id="todoDescription" rows="3"></textarea>
                    </div>
                    
                    <div className="row"> {/* due date & assign person */}
                        <div className="col-md-6 mb-3">
                          <label htmlFor="todoDueDate" className="form-label">Due Date</label>
                          <input type="datetime-local" name="todoDueDate" className="form-control" id="todoDueDate" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="todoPerson" className="form-label">Assign to Person</label>
                          <select className="form-select" name="todoPerson" id="todoPerson">
                            <option value="">-- Select Person (Optional) --</option>
                            <option value="1">Mehrdad Javan</option>
                            <option value="2">Simon Elbrink</option>
                          </select>
                        </div>
                    </div>

                    <div className="mb-3">  {/* attachments */}
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input type="file" name="todoAttatchments" className="form-control" id="todoAttachments" onChange={(event) => attatchmentUpdate(event)} multiple />
                        <button className="btn btn-outline-secondary" type="button"> <i className="bi bi-x-lg"></i> </button> {/* TODO: Add functionality */}
                      </div>
                      <div className="file-list" id="attachmentPreview">
                        {files.map((file, index) => (
                          <p key={index} className="m-0">{file.name}</p>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">  {/* submit */}
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Task
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">  
                <div className="card-header bg-white d-flex justify-content-between align-items-center"> {/* tasks header */}
                    <h5 className="card-title mb-0">Tasks</h5>
                    <div className="btn-group">
                        <button className="btn btn-outline-secondary btn-sm" title="Filter">
                            <i className="bi bi-funnel"></i>
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" title="Sort">
                            <i className="bi bi-sort-down"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {displayTodoItems}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Task;