import { useState } from "react";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState([]);

  function handleUsername(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div>
      <h1>Welcome to ESL App</h1>
      <p>Please log in to continue.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          onChange={handleUsername}
          value={username}
        ></input>
        <input
          type="text"
          placeholder="password"
          onChange={handlePassword}
          value={password}
        ></input>
        <input type="button" value="submit" />
      </form>
      {username &&
        `Your are now logged in as ${username} with the following ${password}`}
    </div>
  );
}
