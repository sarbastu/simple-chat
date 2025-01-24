import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './pages/chat';
import Auth from './pages/auth';
import Profile from './pages/profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/auth' />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
