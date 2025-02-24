import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';
import ProfilePage from './pages/Profile';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className='flex items-center justify-center h-screen'>
        <LoaderCircle className='size-10 animate-spin' />
      </div>
    );

  return (
    <div className=''>
      <Navbar />

      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/settings' element={<SettingsPage />} />
        <Route
          path='/profile'
          element={authUser ? <ProfilePage /> : <Navigate to='/' />}
        />
        <Route
          path='/*'
          element={authUser ? <Navigate to='/' /> : <Navigate to='/' />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
