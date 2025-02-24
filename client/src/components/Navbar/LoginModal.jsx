import { useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import AuthForm from '../AuthForm';

const LoginModal = () => {
  const { login, isLoggingIn, setError } = useAuthStore();

  const modalRef = useRef(null);

  const onSubmit = async (data) => {
    const response = await login(data);
    if (response.success) {
      setError(null);
      modalRef.current?.close();
    }
  };

  return (
    <div>
      <button className='btn' onClick={() => modalRef.current?.showModal()}>
        Login
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

          <h3 className='font-bold text-lg mb-8'>Login</h3>
          <AuthForm
            isSigningUp={false}
            isLoading={isLoggingIn}
            onSubmit={onSubmit}
          />
        </div>
      </dialog>
    </div>
  );
};

export default LoginModal;
