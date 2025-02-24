import { useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import AuthForm from '../AuthForm';
import { useNavigate } from 'react-router-dom';

const SignupModal = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp, setError } = useAuthStore();

  const modalRef = useRef(null);

  const onSubmit = async (data) => {
    const response = await signup(data);
    if (response.success) {
      setError(null);
      modalRef.current?.close();
      navigate('/profile');
    }
  };

  return (
    <div>
      <button className='btn' onClick={() => modalRef.current?.showModal()}>
        Signup
      </button>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </form>

          <h3 className='font-bold text-lg mb-8'>Signup</h3>
          <AuthForm
            isSigningUp={true}
            isLoading={isSigningUp}
            onSubmit={onSubmit}
          />
        </div>
      </dialog>
    </div>
  );
};

export default SignupModal;
