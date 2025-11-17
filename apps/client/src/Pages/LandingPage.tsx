

export default function landingPage() {
  return (
    <div>
      <h1>Welcome to ESL App</h1>
      <p>Please log in to continue.</p>
      <form>
        <input type="text" placeholder="username"></input>
        <input type="text" placeholder="password"></input>
        <input type="button" value="submit" />
      </form>
      {/* You can add login logic later */}
    </div>
  );
}
