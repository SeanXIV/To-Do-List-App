import '../styles/App.css';
import TaskList from './TaskList';
import '../styles/TaskList.css';

const App = () => {
  return (
    <div className="container">
      <h1>To-Do List</h1>
      <TaskList />
    </div>
  );
};

export default App;
