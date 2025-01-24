import Background from '/assets/images/login.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const tabs = ['login', 'signup'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (isSignup) => {
    const errors = [];
    if (!formData.email) {
      errors.unshift('Email is required.');
    }
    if (!formData.password) {
      errors.unshift('Password is required.');
    }
    if (formData.password.length < 7) {
      errors.unshift('Password must be at least 7 characters long.');
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      errors.unshift('Password does not match.');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSignup = activeTab === 'signup';
    const errors = validateForm(isSignup);

    if (errors.length > 0) {
      return errors.forEach((err) => toast.error(err));
    }

    submitFormData(isSignup);
  };

  const submitFormData = async (isSignup) => {
    const { email, password } = formData;
    const route = isSignup ? SIGNUP_ROUTE : LOGIN_ROUTE;
    try {
      const response = await apiClient.post(
        route,
        { email, password },
        { withCredentials: true }
      );
      handleResponseData(response);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleResponseData = async (response) => {
    setUserInfo(response.data.user);
    if (response.data.user.profile) {
      navigate('/chat');
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
      <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div className='flex  flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-4'>
              <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
              <FontAwesomeIcon icon={faGamepad} size='3x' />
            </div>
            <p className='font-medium text-center'>
              Fill in the details to get started!
            </p>
          </div>
          <div className='flex justify-center items-center w-full'>
            <Tabs
              className='w-3/4'
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className='bg-transparent rounded-none w-full mb-4'>
                {tabs.map((tab, i) => (
                  <TabsTrigger
                    key={i}
                    value={tab}
                    className='data-[state=active]:bg-transparent text-black text-opacity90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'
                  >
                    {tab === 'login' ? 'Login' : 'Signup'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab, i) => (
                <TabsContent
                  key={i}
                  value={tab}
                  className='flex flex-col gap-5 mt-0'
                >
                  <Input
                    placeholder='Email'
                    type='email'
                    name='email'
                    value={formData.email}
                    className='rounded-full p-6'
                    onChange={handleInputChange}
                  />
                  <Input
                    placeholder='Password'
                    type='password'
                    name='password'
                    value={formData.password}
                    className='rounded-full p-6'
                    onChange={handleInputChange}
                  />
                  {tab === 'signup' && (
                    <Input
                      placeholder='Confirm Password'
                      type='password'
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      className='rounded-full p-6'
                      onChange={handleInputChange}
                    />
                  )}
                  <Button className='rounded-full p-6' onClick={handleSubmit}>
                    {tab === 'login' ? 'Log In' : 'Sign Up'}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex justify-center items-center'>
          <img
            src={Background}
            alt='Background Authentication'
            className='h-[600px] rounded-3xl'
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
