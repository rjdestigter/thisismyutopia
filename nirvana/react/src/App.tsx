import React from "react";
import "./App.scss";
import { Email, Password } from "./modules/Input";

interface Todo {
  id: number;
  completed: boolean;
  title: string;
  userId: number;
}

function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [token, setToken] = React.useState<undefined | string>(undefined);
  const [todos, setTodos] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    if (submitting) {
      fetch("http://localhost:4200/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((_) => _.token)
        .then((token) =>
          fetch("http://localhost:4200/todos", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((_) => _.json())
            .then((todos) => {
              setToken(token);
              setTodos(todos);
            })
        )
        .then(() => setSubmitting(false))
        .catch(() => setSubmitting(false));
    }
  }, [submitting]);

  return (
    <div className="App">
      <form onSubmit={() => false}>
        <section>
          <label htmlFor="email">Email</label>
          <Email
            disabled={submitting}
            name="email"
            value={username}
            onChange={setUsername}
          />
        </section>
        <section>
          <label htmlFor="password">Password</label>
          <Password
            disabled={false}
            name="password"
            value={password}
            onChange={setPassword}
          />
        </section>

        <section>
          <button
            disabled={submitting}
            type="submit"
            onClick={() => setSubmitting(true)}
          >
            Sign-in
          </button>
        </section>
      </form>
    </div>
  );
}

export default App;
