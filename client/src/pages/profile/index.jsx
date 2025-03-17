import { Camera, LoaderCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [imagePreview, setImagePreview] = useState(authUser?.profileImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      displayName: authUser?.displayName || '',
      imagePreview: authUser?.profileImage || 'assets/images/avatar.png',
    },
  });

  const onSubmit = async (data) => {
    const { displayName, image } = data;
    const response = await updateProfile(image[0], displayName);

    if (response.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(response.error || 'Profile update failed');
    }
  };

  return (
    <div className='min-h-screen py-10 flex flex-col gap-4 justify-center items-center w-full border'>
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        <fieldset className='fieldset w-xs md:w-xl bg-base-200 border border-base-300 p-4 rounded-box'>
          <legend className='fieldset-legend text-2xl'>
            Profile Information
          </legend>

          {/* Profile Image */}
          <div className='flex flex-col gap-12 '>
            <div className='flex justify-center'>
              <label htmlFor='avatar-upload' className='cursor-pointer'>
                <div className='avatar'>
                  <div className='ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 md:w-32'>
                    <img src={imagePreview || watch('imagePreview')} />
                    <Camera className='absolute bottom-0 right-0 size-8' />
                  </div>
                </div>
                <input
                  id='avatar-upload'
                  type='file'
                  accept='image/*'
                  className='hidden file-input w-full max-w-xs'
                  {...register('image')}
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Profile Details */}
            <div className='flex flex-col w-full gap-4'>
              <div className='w-full'>
                <label className='fieldset-label'>Email</label>
                <input
                  type='email'
                  className='input w-full'
                  placeholder={authUser?.email}
                  disabled={true}
                />
              </div>
              <div className='w-full'>
                <label className='fieldset-label mb-2'>Display Name</label>
                <input
                  type='text'
                  className='input w-full'
                  {...register('displayName', {
                    required: 'Display Name is required',
                    minLength: {
                      value: 3,
                      message: 'Display Name must be at least 3 characters',
                    },
                  })}
                />
                {errors.displayName && (
                  <p className='text-red-500 my-1'>
                    {errors.displayName.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type='submit'
              className='btn btn-neutral'
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className='animate-spin' />
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProfilePage;
