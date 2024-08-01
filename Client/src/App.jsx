import axios from 'axios';
import AllRoutes from './AllRoutes/AllRoutes';
import './App.css'

export const baseUrl = "http://localhost:8080";
export const token = localStorage.getItem("token");
export const userId = localStorage.getItem("userId");

// http://13.233.44.111;
// http://localhost:8080

export const axiosInstance = axios.create({
  headers: {
    'Authorization': token
  },
});

function App() {
  return (
    <div className="app">
      <AllRoutes/>
    </div>
  )
}

export default App;
