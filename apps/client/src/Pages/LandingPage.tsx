import { useState } from "react";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [activeUser, setActiveUser] = useState([]);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="border p-30 rounded">
        <h1 className="text-bold text-lg pt-4">Please log in to continue</h1>
        <form onSubmit={handleSubmit} className=" flex flex-col">
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
          <input
            type="button"
            value="submit"
            className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
}
