// API key: id:175

// checkStatus function - verifies success of XML request and returns the error if request is unsuccessful
const checkStatus = (response) => {
  if (response.ok) {
    // .ok returns true if response status is 200-299
    return response;
  }
  throw new Error("Request was either a 404 or 500");
};

// json function - if response is successful, return JSON data
const json = (response) => response.json();

// Task class component - renders each individual task as a separate component detailing the task description and status
class Task extends React.Component {
  render() {
    const { task, onDelete, onComplete } = this.props;
    const { id, content, completed } = task;

    return (
      <div className="row mb-1">
        <p className="col">{content}</p>
        <button onClick={() => onDelete(id)}>Delete</button>
        <input
          className="d-inline-block mt-2"
          type="checkbox"
          onChange={() => onComplete(id, completed)}
          checked={completed}
        />
      </div>
    );
  }
}

// ToDoList class component - stores state of todo items and new entries
class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_task: "",
      tasks: [],
      filter: "all",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  // Fetch tasks from API once component successfully renders
  componentDidMount() {
    this.fetchTasks();
  }

  // fetchTasks function - retrieves all tasks from API
  fetchTasks() {
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=175")
      .then(checkStatus)
      .then(json)
      .then((response) => {
        console.log(response);
        this.setState({ tasks: response.tasks });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // handleChange function - updates the state of new_task upon updated input data from user
  handleChange(event) {
    this.setState({
      new_task: event.target.value,
    });
  }

  // handleSubmit function - when the user submits a new task, validate and add it to the list
  handleSubmit(event) {
    event.preventDefault();
    // Validate and clean up new task data
    let { new_task } = this.state;
    new_task = new_task.trim();
    if (!new_task) {
      return;
    }

    // Once validated, generate a POST request
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=175", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: {
          content: new_task,
        },
      }),
    })
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ new_task: "" });
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  // deleteTask function - deletes a task based on the targetted button
  deleteTask(id) {
    // Ensure that a valid ID is provided or otherwise return early
    if (!id) {
      return;
    }

    // DELETE request - deletes the targetted task and re-renders the list of tasks to reflect the change
    fetch(
      `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=175`,
      {
        method: "DELETE",
        mode: "cors",
      }
    )
      .then(checkStatus)
      .then(json)
      // Re-render task list to reflect deleted task
      .then((data) => {
        this.fetchTasks();
      })
      // If the request fails, log the error message in the console
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  // toggleComplete function - marks a task as complete or active
  toggleComplete(id, completed) {
    // Return early if no ID is targetted for the PUT request
    if (!id) {
      return;
    }

    // Evaluate the updated status of the task to perform the update
    const newState = completed ? "active" : "complete";

    // PUT request - updates the status of a task as active/complete
    fetch(
      `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_${newState}?api_key=175`,
      {
        method: "PUT",
        mode: "cors",
      }
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  // toggleFilter function - updates the filter state depending on user selection
  toggleFilter(e) {
    console.log(e.target.name);
    this.setState({
      filter: e.target.name,
    });
  }

  // render function
  render() {
    const { new_task, tasks, filter } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-3">To Do List</h2>
            {/* Determine if filter is selected and apply if so when rendering individual tasks */}
            {tasks.length > 0 ? (
              tasks
                .filter((task) => {
                  if (filter === "all") {
                    return true;
                  } else if (filter === "active") {
                    return !task.completed;
                  } else {
                    return task.completed;
                  }
                })
                .map((task) => {
                  // Render each task in the DOM if any exist
                  return (
                    <Task
                      key={task.id}
                      task={task}
                      onDelete={this.deleteTask}
                      onComplete={this.toggleComplete}
                    />
                  );
                })
            ) : (
              // Display empty status if no tasks exist in returned data
              <p>no tasks here</p>
            )}

            {/* Filter Tasks Section */}
            <div className="mt-3">
              <label>
                <input
                  type="checkbox"
                  name="all"
                  checked={filter === "all"}
                  onChange={this.toggleFilter}
                />{" "}
                All
              </label>
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={filter === "active"}
                  onChange={this.toggleFilter}
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  name="completed"
                  checked={filter === "completed"}
                  onChange={this.toggleFilter}
                />{" "}
                Completed
              </label>
            </div>

            {/* Input Task Section */}
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2 mb-2"
                placeholder="new task"
                value={new_task}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary mb-2">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ToDoList />, document.getElementById("root"));
