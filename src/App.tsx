import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { StudentsCreateForm } from './../ui-components/';



const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <Router>
      <main>
        <h1>My todos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
              {todo.content}
            </li>
          ))}
        </ul>
        <div>
          🥳 App successfully hosted. Try creating a new todo.
          <br />
          <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
            Review next step of this tutorial.
          </a>
        </div>
        <div>
          {/* Add a button to navigate to the form */}
          <Link to="/StudentsCreateForm">
            <button>Go to Form</button>
          </Link>
        </div>

        {/* Define routes */}
        <Routes>
          <Route path="/StudentsCreateForm" element={<StudentsCreateForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
