import AllRoutes from './AllRoutes/AllRoutes';
import './App.css'

export const baseUrl = "http://localhost:8080";

// http://13.233.44.111;
// http://localhost:8080

function App() {
  return (
    <div className="app">
      <AllRoutes/>
    </div>
  )
}

export default App;

