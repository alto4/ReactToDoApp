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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
  }

  // Fetch tasks from API once component successfully renders
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
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=48", {
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

  // render function
  render() {
    const { new_task, tasks } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-3">To Do List</h2>
            {tasks.length > 0 ? (
              tasks.map((task) => {
                // Render each task in the DOM if any exist
                return <Task key={task.id} task={task} />;
              })
            ) : (
              // Display empty status if no tasks exist in returned data
              <p>no tasks here</p>
            )}
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
