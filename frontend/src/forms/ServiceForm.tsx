import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { serviceSchema, type ServiceFormValues } from '@/schema/service.schema';
import { TextInput } from '@/components/inputs/TextInput';
import { NumberInput } from '@/components/inputs/NumberInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { serviceService } from '@/services/service.service';
import { useToast } from '@/components/toast/Toaster';

interface ServiceFormProps {
  onSuccess?: () => void;
}

export const ServiceForm = ({ onSuccess }: ServiceFormProps) => {
  const toast = useToast();

  const initialValues: ServiceFormValues = {
    name: '',
    fee: 0,
  };

  const handleSubmit = async (values: ServiceFormValues, { resetForm }: any) => {
    try {
      await serviceService.createService({
        name: values.name,
        fee: values.fee,
      });
      await serviceService.fetchServices();
      
      toast.success('Service added successfully');
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add service');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(serviceSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex gap-2 items-start relative">
          <div className="flex-6">
            <TextInput name="name" label="Add Service" required />
          </div>
          <div className="flex-4">
            <NumberInput name="fee" label="Fee" min={1} required />
          </div>
          <PrimaryButton type="submit" disabled={isSubmitting} className="h-10 px-4 shrink-0 absolute top-7 right-0">
            {isSubmitting ? 'Adding...' : 'Add'}
          </PrimaryButton>
          <div className='h-10 px-4 shrink-0 flex-1' />
        </Form>
      )}
    </Formik>
  );
};
