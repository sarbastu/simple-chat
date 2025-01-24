import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './pages/chat';
import Auth from './pages/auth';
import Profile from './pages/profile';
import { useAppStore } from './store';
import { useEffect, useState } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const ProtectedRoute = ({ children, requiresAuth }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to='/auth' />;
  }

  if (!requiresAuth && isAuthenticated) {
    return <Navigate to='/chat' />;
  }

  return children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO);

        if (response.status === 200 && response.data.user.id) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect based on authentication state */}
        <Route
          path='*'
          element={<Navigate to={userInfo ? '/chat' : '/auth'} replace />}
        />

        {/* Public Route (Authentication Page) */}
        <Route
          path='/auth'
          element={
            <ProtectedRoute requiresAuth={false}>
              <Auth />
            </ProtectedRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path='/chat'
          element={
            <ProtectedRoute requiresAuth={true}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute requiresAuth={true}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
