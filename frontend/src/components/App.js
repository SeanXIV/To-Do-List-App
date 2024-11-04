import '../styles/App.css';
import TaskList from './TaskList';
import '../styles/TaskList.css';
import { FaListAlt } from 'react-icons/fa'; // Import the icon

const App = () => {
  return (
    <div className="container">
      <h1><FaListAlt /> To-Do List</h1>
      <TaskList />
    </div>
  );
};

export default App;
