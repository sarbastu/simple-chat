import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();

  const handleClick = (path) => {
    navigate(path);
    document.activeElement.blur();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='flex-none'>
      <div className='dropdown dropdown-end'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-ghost btn-circle avatar'
        >
          <div className='w-10 rounded-full'>
            <img
              alt='Tailwind CSS Navbar component'
              src={authUser.profileImage || 'assets/images/avatar.png'}
            />
          </div>
        </div>

        <ul
          tabIndex={0}
          className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
        >
          <li>
            <a
              className='justify-between'
              onClick={() => handleClick('/profile')}
            >
              Profile
            </a>
          </li>
          <li>
            <a onClick={() => handleClick('/settings')}>Settings</a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
