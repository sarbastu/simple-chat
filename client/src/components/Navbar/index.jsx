import { useAuthStore } from '../../store/useAuthStore';
import ProfileDropdown from '../Navbar/ProfileDropdown';
import LoginModal from '../Navbar/LoginModal';
import SignupModal from '../Navbar/SignupModal';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className='navbar bg-base-100 fixed shadow-sm px-8'>
      <div className='flex-1' onClick={() => navigate('/')}>
        <a className='btn btn-ghost text-xl'>Simple Chat</a>
      </div>

      <div className='flex gap-2'>
        {authUser ? (
          <ProfileDropdown />
        ) : (
          <>
            <SignupModal />
            <LoginModal />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
