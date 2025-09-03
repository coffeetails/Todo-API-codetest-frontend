import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
import './Task.css';

const TaskItem = ({ todo, displayUpdatedTodos, updateTodos }) => {

	const completeTodo = async () => {
		const updatedTodo = { ...todo, completed: !todo.completed };
		try {
			await taskService.updateTodo(updatedTodo);
			displayUpdatedTodos(updatedTodo);
		} catch (err) {
			console.error('Failed to update todo on server', err);
		}
	}

	const editTodo = (e) => {
		console.log("Edit, START!", e);
	}

	const deleteTodo = async (e) => {
		console.log("Deleted!", e);

		try {
			await taskService.deleteTodo(todo);
			// displayUpdatedTodos(todo);
			updateTodos();
		} catch (err) {
			console.error('Failed to delete todo on server', err);
		}
	}


	function parseDate(date) {
		return date.slice(0, 10);
	}
	function allowDelete() {
		return !authService.isAdmin(authService.getCurrentUser());
	}


	return (
		<div className="list-group-item list-group-item-action">
			<div className="d-flex w-100 justify-content-between align-items-start">
				<div className="flex-grow-1">
					<div className="d-flex justify-content-between">
						<h6 className="mb-1">{todo.title}</h6>
						<small className="text-muted ms-2">Created: {parseDate(todo.createdAt)}</small>
					</div>
					<p className="mb-1 text-muted small">{todo.description}</p>
					<div className="d-flex align-items-center flex-wrap">
						<small className="text-muted me-2"> <i className="bi bi-calendar-event"></i>Due: {parseDate(todo.dueDate)}</small>
						<span className="badge bg-info me-2"> <i className="bi bi-person"></i>{/* TODO: person id → name */} {todo.personId}</span>
						<span className="badge bg-info me-2"> <i className="bi bi-file-earmark"></i> {todo.numberOfAttachments}</span>
						<span className="badge bg-warning text-dark me-2">{todo.completed ? "Completed" : "Pending"}</span>
					</div>
				</div>
				<div className="btn-group ms-3">
					<button className="btn btn-outline-success btn-sm" title="Complete" onClick={() => completeTodo()}>
						<i className="bi bi-check-lg"></i>
					</button>

					<button className="btn btn-outline-primary btn-sm" title="Edit" onClick={(e) => editTodo(e)} >
						<i className="bi bi-pencil"></i>
					</button>

					<button className="btn btn-outline-danger btn-sm" title="Delete" onClick={(e) => deleteTodo(e)} disabled={allowDelete()} >
						<i className="bi bi-trash"></i>
					</button>
				</div>
			</div >
		</div >
	);
}

export default TaskItem;