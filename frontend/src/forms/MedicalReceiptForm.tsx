import { Formik, Form, useFormikContext } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { receiptSchema, type ReceiptFormValues } from '@/schema/receipt.schema';
import { TextInput } from '@/components/inputs/TextInput';
import { NumberInput } from '@/components/inputs/NumberInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { doctorService, type Doctor } from '@/services/doctor.service';
import { serviceService, type Service } from '@/services/service.service';
import { useToast } from '@/components/toast/Toaster';
import { useEffect, useState } from 'react';
import api, { type ApiEnvelope } from '@/services/axios';
import type { Patient } from '@/services/patient.service';

interface MedicalReceiptFormProps {
  onSuccess?: () => void;
  refreshKey?: number;
}

export const MedicalReceiptForm = ({ onSuccess, refreshKey }: MedicalReceiptFormProps) => {
  const toast = useToast();
  const [doctors, setDoctors] = useState(doctorService.getDoctorsFromStorage());
  const [services, setServices] = useState(serviceService.getServicesFromStorage());

  useEffect(() => {
    // Load doctors and services on mount and when refreshKey changes
    setDoctors(doctorService.getDoctorsFromStorage());
    setServices(serviceService.getServicesFromStorage());
  }, [refreshKey]);

  const initialValues: ReceiptFormValues = {
    doctor: '',
    service: '',
    patient_name: '',
    gender: 'male',
    age: 0,
    fee: 0,
    discount: 0,
    total: 0,
  };

  const handleSubmit = async (values: ReceiptFormValues, { resetForm }: any) => {
    try {
      // const response = 
      await api.post<ApiEnvelope<Patient>>('/patient', values);

      toast.success('Receipt created successfully');

      // Generate printable receipt
      generatePrintableReceipt(values);

      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create receipt');
    }
  };

  const generatePrintableReceipt = (values: ReceiptFormValues) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const doctor = doctors.find((d) => d.id === values.doctor || d.doctorName === values.doctor);
    const service = services.find((s) => s.id === values.service || s.serviceName === values.service);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin: 10px 0; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>Medical Receipt</h2>
            </div>
            <div class="details">
              <p><strong>Doctor:</strong> ${doctor?.doctorName || values.doctor}</p>
              <p><strong>Patient:</strong> ${values.patient_name}</p>
              <p><strong>Gender:</strong> ${values.gender}</p>
              <p><strong>Age:</strong> ${values.age}</p>
              <p><strong>Service:</strong> ${service?.serviceName || values.service}</p>
              <p><strong>Fee:</strong> Rs. ${values.fee}</p>
              <p><strong>Discount:</strong> Rs. ${values.discount}</p>
            </div>
            <div class="total">
              <p><strong>Total:</strong> Rs. ${values.total}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Component to handle form field effects
  const ReceiptFormFields = ({
    doctors,
    services,
  }: {
    doctors: Doctor[];
    services: Service[];
  }) => {
    const { values, setFieldValue, isSubmitting } = useFormikContext<ReceiptFormValues>();

    // Update fee when service changes
    useEffect(() => {
      if (values.service) {
        const selectedService = services.find(
          (s) => s.id === values.service || s.serviceName === values.service
        );
        if (selectedService && values.fee !== selectedService.fee) {
          setFieldValue('fee', selectedService.fee);
        }
      } else {
        if (values.fee !== 0) {
          setFieldValue('fee', 0);
        }
      }
    }, [values.service, services, setFieldValue, values.fee]);

    // Calculate total
    const total = values.fee - values.discount;
    useEffect(() => {
      if (values.total !== total) {
        setFieldValue('total', total);
      }
    }, [total, setFieldValue, values.total]);

    const maxDiscount = values.fee;

    return (
      <Form className="space-y-4">
        {/* Medical Center Header */}
        <div className="mb-2 pb-4 ">
          <h4 className='text-black font-bold text-center'>Medical Reciept</h4>
        </div>

        <SelectInput
          name="doctor"
          label="Select Doctor"
          placeholder="Select Doctor"
          options={doctors.map((d) => ({
            value: d.id || d.doctorName,
            label: d.doctorName,
          }))}
          required
        />
        <SelectInput
          name="service"
          label="Select Service"
          placeholder='Select Service'
          options={services.map((s) => ({
            value: s.id || s.serviceName,
            label: s.serviceName,
          }))}
          required
        />
        <TextInput name="patient_name" label="Patient Name" required />
        <div className="flex gap-3">

          <SelectInput
            name="gender"
            label="Select Gender"
            placeholder="Select Gender"
            options={['Male', 'Female']}
            className='flex-4'
            required
          />
          <NumberInput className='flex-3' name="age" label="Patient Age" min={0} required />

        </div>


        <div className="flex gap-3">

        <NumberInput className='flex-1' name="fee" label="Fee" readonly />
        <NumberInput
        className='flex-1'
          name="discount"
          label="Discount"
          min={0}
          max={maxDiscount}
        />
        </div>
        <PrimaryButton type="submit" disabled={isSubmitting} className="w-full h-10">
          {isSubmitting ? 'Generating...' : 'Generate Receipt'}
        </PrimaryButton>

        
      </Form>
    );   
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(receiptSchema)}
      onSubmit={handleSubmit}
    >
      <ReceiptFormFields doctors={doctors} services={services} />
    </Formik>
  );
};
