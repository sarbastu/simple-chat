import avatarImage from '/assets/images/avatar.png';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import {
  UPDATE_PROFILE_ROUTE,
  UPLOAD_PROFILE_IMAGE_ROUTE,
} from '@/utils/constants';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const colors = ['#aa2b2b', '#2baa2b', '#2b2baa', '#2baaaa', '#aa2baa'];

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setUserName(userInfo.userName);
      setSelectedColor(userInfo.color);
    }
  }, [userInfo]);

  const validateForm = () => {
    const errors = [];
    if (!userName) {
      errors.unshift('Username required.');
    }
    if (!selectedColor) {
      errors.unshift('Color not selected.');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      return errors.forEach((err) => toast.error(err));
    }
    try {
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {
        userName,
        color: selectedColor,
      });
      if (response.status === 200 && response.data) {
        setUserInfo({ ...userInfo, ...response.data.user });
        if (image) {
          await uploadImage();
        } else {
          toast.success('Update successful.');
        }
      }
    } catch (error) {
      setImage(null);
      toast.error(error.response.data.error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    try {
      const response = await apiClient.post(UPLOAD_PROFILE_IMAGE_ROUTE, {
        image,
      });
      setUserInfo({ ...userInfo, ...response.data.user });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className='bg-neutral-900 h-screen flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <div
          className='absolute top-5 left-5 cursor-pointer'
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon
            icon={faLeftLong}
            className='text-4xl text-white/90 hover:text-white transition-colors'
          />
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {/* Avatar Section */}
          <div className='flex flex-col gap-6 items-center'>
            {/* Image */}
            <div
              className='relative'
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <label htmlFor='avatar-upload' className='cursor-pointer'>
                <Avatar
                  className={`h-32 w-32 md:h-48 md:w-48 rounded-full border-4 transition-all ${
                    hovered ? 'border-white/50' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: selectedColor }}
                >
                  <AvatarImage
                    src={image || userInfo.image || avatarImage}
                    alt='profile image'
                    className='object-cover w-full h-full'
                  />

                  {hovered && (
                    <div className='absolute w-full h-full bg-black/50 flex justify-center items-center'>
                      Upload Image
                    </div>
                  )}
                </Avatar>
              </label>
              <input
                key={image}
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
            {/* Color */}
            <div className='flex gap-3 flex-wrap justify-center'>
              {colors.map((color, index) => (
                <label key={`${color}-${index}`} className='cursor-pointer'>
                  <input
                    type='radio'
                    name='color'
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => setSelectedColor(color)}
                    className='hidden'
                  />
                  <div
                    className={`w-8 h-8 border-2 rounded-full transition-transform ${
                      selectedColor === color
                        ? 'border-white scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
              <input
                onChange={(e) => setSelectedColor(e.target.value)}
                type='color'
                className='w-8 h-8 rounded-md p-0.5'
              />
            </div>
            {/* Username */}
            <div className='flex flex-col gap-6'>
              <div className='space-y-4'>
                <label className='text-white text-lg'>Username</label>
                <input
                  type='text'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={userInfo?.userName || 'Enter your name'}
                  className='w-full p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700
              transition-colors self-center text-lg font-medium'
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
