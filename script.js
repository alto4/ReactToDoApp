var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// API key: id:175

// checkStatus function - verifies success of XML request and returns the error if request is unsuccessful
var checkStatus = function checkStatus(response) {
  if (response.ok) {
    // .ok returns true if response status is 200-299
    return response;
  }
  throw new Error("Request was either a 404 or 500");
};

// json function - if response is successful, return JSON data
var json = function json(response) {
  return response.json();
};

// Task class component - renders each individual task as a separate component detailing the task description and status

var Task = function (_React$Component) {
  _inherits(Task, _React$Component);

  function Task() {
    _classCallCheck(this, Task);

    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  _createClass(Task, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          task = _props.task,
          onDelete = _props.onDelete,
          onComplete = _props.onComplete;
      var id = task.id,
          content = task.content,
          completed = task.completed;


      return React.createElement(
        "div",
        { className: "row mb-1" },
        React.createElement(
          "p",
          { className: "col" },
          content
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return onDelete(id);
            } },
          "Delete"
        ),
        React.createElement("input", {
          className: "d-inline-block mt-2",
          type: "checkbox",
          onChange: function onChange() {
            return onComplete(id, completed);
          },
          checked: completed
        })
      );
    }
  }]);

  return Task;
}(React.Component);

// ToDoList class component - stores state of todo items and new entries


var ToDoList = function (_React$Component2) {
  _inherits(ToDoList, _React$Component2);

  function ToDoList(props) {
    _classCallCheck(this, ToDoList);

    var _this2 = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

    _this2.state = {
      new_task: "",
      tasks: []
    };
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
    _this2.fetchTasks = _this2.fetchTasks.bind(_this2);
    _this2.deleteTask = _this2.deleteTask.bind(_this2);
    _this2.toggleComplete = _this2.toggleComplete.bind(_this2);
    return _this2;
  }

  // Fetch tasks from API once component successfully renders


  _createClass(ToDoList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTasks();
    }

    // fetchTasks function - retrieves all tasks from API

  }, {
    key: "fetchTasks",
    value: function fetchTasks() {
      var _this3 = this;

      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=175").then(checkStatus).then(json).then(function (response) {
        console.log(response);
        _this3.setState({ tasks: response.tasks });
      }).catch(function (error) {
        console.error(error.message);
      });
    }

    // handleChange function - updates the state of new_task upon updated input data from user

  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({
        new_task: event.target.value
      });
    }

    // handleSubmit function - when the user submits a new task, validate and add it to the list

  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      var _this4 = this;

      event.preventDefault();
      // Validate and clean up new task data
      var new_task = this.state.new_task;

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
            content: new_task
          }
        })
      }).then(checkStatus).then(json).then(function (data) {
        _this4.setState({ new_task: "" });
        _this4.fetchTasks();
      }).catch(function (error) {
        _this4.setState({ error: error.message });
        console.log(error);
      });
    }

    // deleteTask function - deletes a task based on the targetted button

  }, {
    key: "deleteTask",
    value: function deleteTask(id) {
      var _this5 = this;

      // Ensure that a valid ID is provided or otherwise return early
      if (!id) {
        return;
      }

      // DELETE request - deletes the targetted task and re-renders the list of tasks to reflect the change
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "?api_key=175", {
        method: "DELETE",
        mode: "cors"
      }).then(checkStatus).then(json)
      // Re-render task list to reflect deleted task
      .then(function (data) {
        _this5.fetchTasks();
      })
      // If the request fails, log the error message in the console
      .catch(function (error) {
        _this5.setState({ error: error.message });
        console.log(error);
      });
    }

    // toggleComplete function - marks a task as complete or active

  }, {
    key: "toggleComplete",
    value: function toggleComplete(id, completed) {
      var _this6 = this;

      // Return early if no ID is targetted for the PUT request
      if (!id) {
        return;
      }

      // Evaluate the updated status of the task to perform the update
      var newState = completed ? "active" : "complete";

      // PUT request - updates the status of a task as active/complete
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "/mark_" + newState + "?api_key=175", {
        method: "PUT",
        mode: "cors"
      }).then(checkStatus).then(json).then(function (data) {
        _this6.fetchTasks();
      }).catch(function (error) {
        _this6.setState({ error: error.message });
        console.log(error);
      });
    }

    // render function

  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _state = this.state,
          new_task = _state.new_task,
          tasks = _state.tasks;

      return React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-12" },
            React.createElement(
              "h2",
              { className: "mb-3" },
              "To Do List"
            ),
            tasks.length > 0 ? tasks.map(function (task) {
              // Render each task in the DOM if any exist
              return React.createElement(Task, {
                key: task.id,
                task: task,
                onDelete: _this7.deleteTask,
                onComplete: _this7.toggleComplete
              });
            }) :
            // Display empty status if no tasks exist in returned data
            React.createElement(
              "p",
              null,
              "no tasks here"
            ),
            React.createElement(
              "form",
              { onSubmit: this.handleSubmit, className: "form-inline my-4" },
              React.createElement("input", {
                type: "text",
                className: "form-control mr-sm-2 mb-2",
                placeholder: "new task",
                value: new_task,
                onChange: this.handleChange
              }),
              React.createElement(
                "button",
                { type: "submit", className: "btn btn-primary mb-2" },
                "Submit"
              )
            )
          )
        )
      );
    }
  }]);

  return ToDoList;
}(React.Component);

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById("root"));