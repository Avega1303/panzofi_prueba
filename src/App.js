import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from 'pages/Home';
import AdminPage from 'pages/AdminPage';
import UserPage from 'pages/UserPage';

function App() {
  return (
        <Router>
            <Routes>
                {/*Home Display*/}
                <Route path="/" element={<Home />} />
                {/*Admin Display*/}
                <Route path="/admin_page" element={<AdminPage />} />
                {/*User Display*/}
                <Route path="/user_page" element={<UserPage />} />
            </Routes>
        </Router>
  );
}

export default App;
