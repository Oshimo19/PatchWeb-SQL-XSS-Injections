import "./App.css";
import UsersList from "./components/UsersList";
import Comments from "./components/Comments";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UsersList />
        <Comments />
      </header>
    </div>
  );
}

export default App;