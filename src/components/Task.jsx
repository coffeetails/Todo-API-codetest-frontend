import { useEffect, useState, useRef } from 'react';
import { taskService } from '../services/taskService.js';
//import { authService } from '../services/authService.js';
import './Task.css';
import Sidebar from './Sidebar';
import Header from "./Header.jsx";
import TaskItem from './TaskItem.jsx';
import { useForm } from "react-hook-form";

// TODO: make this component functional by implementing state management and API calls
const Task = () => {
  const [displayFilter, setDisplayFilter] = useState(false);
  const [displaySort, setDisplaySort] = useState(false);
  const dropdownFilterRef = useRef(null);
  const dropdownSortRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [files, setFiles] = useState([]);
  const attachmentsInput = useRef(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful
    },
  } = useForm({
    defaultValues: {
      todoTitle: '',
      todoDescription: '',
      todoDueDate: '',
      todoPerson: '',
      todoAttatchments: ''
    }
  });


  useEffect(() => {
    updateTodos();
    const handleClickOutside = (event) => {
      if (dropdownFilterRef.current && !dropdownFilterRef.current.contains(event.target)) {
        setDisplayFilter(false);
      }
      if (dropdownSortRef.current && !dropdownSortRef.current.contains(event.target)) {
        setDisplaySort(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
      attatchmentDelete();
    }
  }, [formState, isSubmitSuccessful, reset]);


  const addTodo = async (data) => {
    const newTodo = {
      "id": 0,
      "title": data.todoTitle,
      "description": data.todoDescription ?? '',
      "completed": false,
      "createdAt": new Date(),
      "updatedAt": null,
      "dueDate": data.todoDueDate.length != 0 ? data.todoDueDate : 'anytime',
      "personId": data.todoPerson ? parseInt(data.todoPerson) + 1 : 1,
      "numberOfAttachments": attachmentsInput.current.files.length,
    };
    console.log("→→→ newTodo", newTodo);
    console.log("attachmentsInput", attachmentsInput.current.files.length);

    try {
      await taskService.addTodo(newTodo);

      updateTodos();
    } catch (error) {
      setError("root", error);
      console.log(error);
    }
  }

  async function updateTodos() {
    try {
      const todos = await taskService.getTodos()
      if (Array.isArray(todos)) {
        setTodos(todos);
        setVisibleTodos(todos);
      } else {
        console.error('Expected an array but got:', todos);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("whoops, someting went wrong when fetching the todos");

    }
  }

  function sortTodos(sortingMethod) {
    const allTodos = [...visibleTodos];

    if (sortingMethod == "byCreatedDecending") {
      allTodos.sort((todoA, todoB) => new Date(todoB.createdAt) - new Date(todoA.createdAt));
      setVisibleTodos(allTodos);

    } else if (sortingMethod == "byCreatedAcending") {
      allTodos.sort((todoA, todoB) => new Date(todoA.createdAt) - new Date(todoB.createdAt));
      setVisibleTodos(allTodos);

    } else if (sortingMethod == "byDueDateDecending") {
      allTodos.sort((todoA, todoB) => new Date(todoB.dueDate) - new Date(todoA.dueDate));
      setVisibleTodos(allTodos);

    } else if (sortingMethod == "byDueDateAcending") {
      allTodos.sort((todoA, todoB) => new Date(todoA.dueDate) - new Date(todoB.dueDate));
      setVisibleTodos(allTodos);

    }
  }

  function filterTodos(filteringMethod) {
    const allTodos = [...todos];
    if (filteringMethod == "all") {
      setVisibleTodos(todos);
    } else if (filteringMethod == "overdue") {
      setVisibleTodos(allTodos.filter((todo) => {
        // console.log(todo.dueDate);
        // console.log("overdue: ", new Date(todo.dueDate) > new Date());
        // console.log("pending: ", !todo.completed);
        // console.log("both: ", !todo.completed && new Date(todo.dueDate) > new Date());
        
        return !todo.completed && new Date(todo.dueDate) < new Date();
      }));
      
    } else if (filteringMethod == "pending") {
      setVisibleTodos(allTodos.filter(todo => !todo.completed));
    }
    
  }


  const attatchmentUpdate = (event) => {
    const attatchmentNames = Array.from(event.target.files);
    setFiles(attatchmentNames);
  }

  const attatchmentDelete = () => {
    attachmentsInput.current.value = "";
    setFiles([]);
  }

  const toggleDropdownFilter = () => setDisplayFilter(!displayFilter);
  const toggleDropdownSort = () => setDisplaySort(!displaySort);

  const displayUpdatedTodos = (updatedTodo) => {
    setTodos(prev => prev.map(todo => todo.id == updatedTodo.id ? updatedTodo : todo));
    setVisibleTodos(todos);
  };

  const shortestTitle = 3;
  const longestTitle = 40;
  return (
    <div className="dashboard-layout">
      <Sidebar DisplayFilter={false} onClose={() => { }} /> {/* TODO: add sidebar hide/show functionality */}
      <main className="dashboard-main">
        <Header title="Tasks" subtitle="Manage and organize your tasks" onToggleSidebar={() => { }} />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm task-form-section"> {/* add new task */}
                <div className="card-body">
                  <h2 className="card-title mb-4">Add New Task</h2>
                  <form id="todoForm" onSubmit={handleSubmit(addTodo)}>
                    <div className="mb-3"> {/* title */}
                      <label htmlFor="todoTitle" className="form-label">Title</label>
                      <input
                        {...register("todoTitle", {
                          required: "A title is required",
                          minLength: {
                            value: shortestTitle,
                            message: `Title must be longer than ${shortestTitle} characters`
                          },
                          maxLength: {
                            value: longestTitle,
                            message: `Title can't be longer than ${longestTitle} characters`
                          }
                        })}
                        type="text"
                        name="todoTitle"
                        className="form-control"
                        id="todoTitle"
                      />
                      {errors.todoTitle && <small className="text-danger position-absolute">{errors.todoTitle.message}</small>}
                    </div>

                    <div className="mb-3"> {/* desc */}
                      <label htmlFor="todoDescription" className="form-label">Description</label>
                      <textarea
                        {...register("todoDescription")}
                        className="form-control"
                        name="todoDescription"
                        id="todoDescription"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="row"> {/* due date & assign person */}
                      <div className="col-md-6 mb-3">
                        <label htmlFor="todoDueDate" className="form-label">Due Date</label>
                        <input
                          {...register("todoDueDate", {
                            required: "A due date is required"
                          })}
                          type="datetime-local"
                          name="todoDueDate"
                          className="form-control"
                          id="todoDueDate"
                        />
                        {errors.todoDueDate && <small className="text-danger position-absolute">{errors.todoDueDate.message}</small>}
                      </div>
                      <div className="col-md-6 mb-3"> {/* TODO: Set their actual id and name, if possible? */}
                        <label htmlFor="todoPerson" className="form-label">Assign to Person</label>
                        <select
                          {...register("todoPerson")}
                          className="form-select"
                          name="todoPerson"
                          id="todoPerson"
                        >
                          <option value="">-- Select Person (Optional) --</option>
                          <option value="1">Mehrdad Javan</option>
                          <option value="2">Simon Elbrink</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">  {/* attachments */}
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input
                          {...register("todoAttatchments")}
                          type="file"
                          ref={attachmentsInput}
                          name="todoAttatchments"
                          className="form-control"
                          id="todoAttachments"
                          onChange={(event) => attatchmentUpdate(event)}
                          multiple
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => attatchmentDelete()} > <i className="bi bi-x-lg"></i> </button>
                      </div>
                      <div className="file-list" id="attachmentPreview">
                        {files.map((file, index) => (
                          <p key={index} className="m-0">{file.name}</p>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end align-items-md-center">  {/* submit */}
                      {errors.root && <small className="text-danger">{errors.root.message}</small>}
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "" : <i className="bi bi-plus-lg me-2"></i>}
                        {isSubmitting ? "Saving todo" : "Add Task"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4 mb-5">
                <div className="card-header bg-white d-flex justify-content-between align-items-center"> {/* tasks header */}
                  <h5 className="card-title mb-0">Tasks</h5>

                  <div className="btn-group" role="group" aria-label="Button group with nested dropdown">

                    <div className="btn-group dropdown" role="group" ref={dropdownFilterRef}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        onClick={toggleDropdownFilter}
                        aria-haspopup="true"
                        aria-expanded={displayFilter}
                        title="Filter"
                      >
                        <i className="bi bi-funnel"></i>
                      </button>
                      <div className={`dropdown-menu ${displayFilter ? 'show' : ''} mt-4`} aria-labelledby="dropdownMenuButton">
                        <li className="dropdown-item" onClick={() => filterTodos("all")}>All</li>
                        <li className="dropdown-item" onClick={() => filterTodos("overdue")}>Overdue</li>
                        <li className="dropdown-item" onClick={() => filterTodos("pending")}>Pending</li>
                      </div>
                    </div>

                    <div className="btn-group dropdown" role="group" ref={dropdownSortRef}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        onClick={toggleDropdownSort}
                        aria-haspopup="true"
                        aria-expanded={displaySort}
                        title="Sort"
                      >
                        <i className="bi bi-sort-down"></i>
                      </button>
                      <div className={`dropdown-menu ${displaySort ? 'show' : ''} mt-4`} aria-labelledby="dropdownMenuButton">
                        <li className="dropdown-item" onClick={() => sortTodos("byCreatedAcending")}>↑ Created</li>
                        <li className="dropdown-item" onClick={() => sortTodos("byCreatedDecending")}>↓ Created</li>
                        <li className="dropdown-item" onClick={() => sortTodos("byDueDateAcending")}>↑ Due date</li>
                        <li className="dropdown-item" onClick={() => sortTodos("byDueDateDecending")}>↓ Due date</li>
                      </div>
                    </div>

                  </div>

                </div>
                <div className="card-body">
                  <div className="list-group">
                    {visibleTodos.map((todo) => (
                      <TaskItem todo={todo} key={todo.id} displayUpdatedTodos={displayUpdatedTodos} updateTodos={updateTodos} />
                    ))}
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