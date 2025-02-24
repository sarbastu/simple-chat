import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';

const AuthForm = ({ isSigningUp, onSubmit, isLoading }) => {
  const { error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: 'onSubmit' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <div className='mb-4'>
        <label className='fieldset-label'>Email</label>
        <input
          type='email'
          className='input my-2 w-full'
          placeholder='example@example.com'
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && (
          <span className='text-red-500'>{errors.email.message}</span>
        )}
      </div>

      <div className='mb-4'>
        <label className='fieldset-label'>Password</label>
        <input
          type='password'
          className='input my-2 w-full'
          placeholder='*******'
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 7,
              message: 'Password must be at least 7 characters',
            },
          })}
        />
        {errors.password && (
          <span className='text-red-500 mb-4'>{errors.password.message}</span>
        )}
      </div>

      {isSigningUp && (
        <div className='mb-4'>
          <label className='fieldset-label'>Confirm Password</label>
          <input
            type='password'
            className='input w-full my-2'
            placeholder='*******'
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('password') || 'Password does not match',
            })}
          />
          {errors.confirmPassword && (
            <span className='text-red-500'>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      )}

      {error && <p className='text-red-500'>{error}</p>}

      <button
        type='submit'
        className='btn btn-neutral mt-4'
        disabled={isLoading}
      >
        {isLoading ? <LoaderCircle className='animate-spin' /> : 'submit'}
      </button>
    </form>
  );
};

export default AuthForm;
