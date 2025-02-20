import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/Home';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import SettingsPage from './pages/Settings';
import ProfilePage from './pages/profile';

const App = () => {
  return (
    <div className=''>
      <Navbar />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
