import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import todoImage from "../image/todo.png"

const saveTasks = (tasks) => {
  localStorage.setItem('todos', JSON.stringify(tasks));
}

const TodoList = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(''); // Holds the value of the input field
  const [filter, setFilter] = useState('all'); // Holds the current filter type
  const [isLoading, setIsLoading] = useState(false); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(null); // Holds the ID of the task being edited
  

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTasks(storedTodos);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('todos', JSON.stringify(tasks));
  // }, [tasks]);
  

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add a new task
  const handleAddTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    const newTask = {
      title: inputValue,
      completed: false,
      id:uuidv4()
    };

    try {

     const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveTasks(newTasks);
      setInputValue('');
      toast.success('Task added successfully');
    } catch (error) {
      console.log('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  // Handle checkbox change for a task
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    const updatedTodos = tasks.filter((todo) => todo.id !== id);
    setTasks(updatedTodos);
    saveTasks(updatedTodos);
    toast.success('Task deleted successfully');
  };

  // Edit a task
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  // Update a task
  const handleUpdateTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }
    const updatedTask = {
      title: inputValue,
      completed: false
    };
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === editTaskId ? { ...task, title: updatedTask?.title } : task
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setInputValue('');
      setEditTaskId(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.log('Error updating task:', error);
      toast.error('Error updating task');
    }
  };

  // Mark all tasks as completed
  const handleCompleteAll = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'uncompleted') {
      return !task.completed;
    }
    return true;
  });

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img src={todoImage} alt="todo-image" /> Todo List
        </h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask}>
            {editTaskId ? 'Update' : 'Add'}
          </button>
        </div>

        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>

        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange('all')}>
                All
              </a>
              <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                Uncompleted
              </a>
              <a href="#" id="com" onClick={() => handleFilterChange('completed')}>
                Completed
              </a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
