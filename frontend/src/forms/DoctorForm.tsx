import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { doctorSchema, type DoctorFormValues } from '@/schema/doctor.schema';
import { TextInput } from '@/components/inputs/TextInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { doctorService } from '@/services/doctor.service';
import { useToast } from '@/components/toast/Toaster';

interface DoctorFormProps {
  onSuccess?: () => void;
}

export const DoctorForm = ({ onSuccess }: DoctorFormProps) => {
  const toast = useToast();

  const initialValues: DoctorFormValues = {
    name: '',
  };

  const handleSubmit = async (values: DoctorFormValues, { resetForm }: any) => {
    try {
      // Check for uniqueness
      const existingDoctors = doctorService.getDoctorsFromStorage();
      const isDuplicate = existingDoctors.some(
        (d) => d.doctorName.toLowerCase() === values.name.toLowerCase()
      );

      if (isDuplicate) {
        toast.error('Doctor name must be unique');
        return;
      }

      await doctorService.createDoctor({ doctorName:`Dr. ${values.name.toLowerCase()}` });
      await doctorService.fetchDoctors();
      
      toast.success('Doctor added successfully');
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add doctor');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(doctorSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex gap-2 items-center relative">
          <div className="flex-9 relative">
            <span className='absolute left-2 top-9 text-base text-primary '>Dr. </span>
            <TextInput name="name" label="Add Doctor" required inputClassName='pl-9' />
          </div>
          <PrimaryButton type="submit" disabled={isSubmitting} className="h-10 px-4 shrink-0 absolute top-7 right-0">
            {isSubmitting ? 'Adding...' : 'Add'}
          </PrimaryButton>
          <div className='flex-1 shrink-0 h-10 px-4 invisible' />
        </Form>
      )}
    </Formik>
  );
};
