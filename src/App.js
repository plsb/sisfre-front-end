// App.js
import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import AppRoutes from "./routes/AppRoutes";

function App() {

    return (
        <Router>  {/* O Router precisa envolver toda a aplicação */}
            <div className="App">
                <AppRoutes />
            </div>
        </Router>
    );
}

export default App;
