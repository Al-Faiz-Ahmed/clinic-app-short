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

  // Get token from localStorage or default to 1
  const getTokenFromStorage = (): number => {
    const storedToken = localStorage.getItem('receipt_token');
    return storedToken ? parseInt(storedToken, 10) : 5;
  };

  const initialValues: ReceiptFormValues = {
    doctor: '',
    service: '',
    patient_name: '',
    gender: '',
    age: 0,
    fee: 0,
    discount: 0,
    total: 0,
    token: getTokenFromStorage()
  };

  const handleSubmit = async (values: ReceiptFormValues, { resetForm, setFieldValue }: any) => {
    try {
      // const response = 
      await api.post<ApiEnvelope<Patient>>('/patient', {
        doctorId: values.doctor,
        serviceId: values.service,
        patient: values.patient_name,
        age: values.age,
        gender: values.gender,
        fee: values.fee,
        discount: values.discount,
        token: values.token,
        paid: values.total
      });

      toast.success('Receipt created successfully');

      // Generate printable receipt
      generatePrintableReceipt(values);

      // Increment token in localStorage and update form
      const newToken = values.token + 1;
      localStorage.setItem('receipt_token', newToken.toString());

      // Reset form but preserve the new token value
      resetForm({
        values: {
          ...initialValues,
          token: newToken,
        },
      });
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

    // printWindow.document.write(`
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //     <title>Medical Receipt</title>

    //     <style>
    //       /* ===== THERMAL PRINT RESET ===== */
    //       @page {
    //         size: 80mm auto;
    //         margin: 0;
    //       }

    //       * {
    //         box-sizing: border-box;
    //         font-family: monospace;
    //       }

    //       body {
    //         margin: 0;
    //         padding: 0;
    //       }

    //       .receipt {
    //         width: 80mm;
    //         padding: 6mm;
    //         font-size: 16px;
    //         line-height: 1.4;
    //         color: #000;
    //       }

    //       .header {
    //         text-align: center;
    //         font-weight: bold;
    //         margin-bottom: 8px;
    //         border-bottom: 1px dashed #000;
    //         padding-bottom: 6px;
    //       }

    //       .sub-header {
    //         text-align: center;
    //         margin-bottom: 10px;
    //         font-size: 14px;
    //       }

    //       .row {
    //         display: flex;
    //         justify-content: space-between;
    //         margin-bottom: 6px;
    //       }

    //       .label {
    //         font-weight: bold;
    //       }

    //       .services {
    //         margin: 8px 0;
    //       }

    //       .total {
    //         display: flex;
    //         justify-content: space-between;
    //         border-top: 2px solid #000;
    //         padding-top: 6px;
    //         margin-top: 10px;
    //         font-size: 18px;
    //         font-weight: bold;
    //       }

    //       .footer {
    //         text-align: center;
    //         margin-top: 12px;
    //         font-size: 12px;
    //         border-top: 1px dashed #000;
    //         padding-top: 6px;
    //       }
    //     </style>
    //   </head>

    //   <body>

    //     <div class="receipt">

    //       <div class="header">
    //         HEALTH CARE CLINIC<br>
    //         Medical Receipt
    //       </div>

    //       <div class="sub-header">
    //         Date: ${new Date().toLocaleString()}
    //       </div>

    //       <div class="row">
    //         <span class="label">Doctor</span>
    //         <span>${doctor?.doctorName || values.doctor}</span>
    //       </div>

    //       <div class="row">
    //         <span class="label">Patient</span>
    //         <span>${values.patient_name}</span>
    //       </div>

    //       <div class="row">
    //         <span class="label">Gender</span>
    //         <span>${values.gender}</span>
    //       </div>

    //       <div class="row">
    //         <span class="label">Age</span>
    //         <span>${values.age}</span>
    //       </div>

    //       <div class="services">
    //         <strong>Service</strong><br>
    //         ${service?.serviceName || values.service}
    //       </div>

    //       <div class="row">
    //         <span class="label">Fee</span>
    //         <span>Rs. ${values.fee}</span>
    //       </div>

    //       <div class="row">
    //         <span class="label">Discount</span>
    //         <span>Rs. ${values.discount}</span>
    //       </div>

    //       <div class="total">
    //         <span>TOTAL</span>
    //         <span>Rs. ${values.total}</span>
    //       </div>

    //       <div class="footer">
    //         Thank you for your visit<br>
    //         ** Computer Generated Receipt **
    //       </div>

    //     </div>

    //   </body>
    //   </html>
    //   `);

    const modifyTokenNumber = values.token < 10 ? `0${values.token}` : values.token;

    printWindow.document.writeln(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Receipt</title>
      
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
      
          * {
            box-sizing: border-box;
            font-family: monospace;
          }
      
          body {
            margin: 0;
            padding: 0;
          }
      
          .receipt {
            width: 80mm;
            padding: 4mm 3mm;
            padding-top: 0px !important;
            font-size: 15px;
            line-height: 1.4;
            color: #000;
          }
      
          .center {
            text-align: center;
          }
      
          .clinic {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
          }
      
          .branch {
            margin-top: 4px;
            font-size: 14px;
          }
      
          .dotted {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
      
          .row {
            display: flex;
            margin: 4px 0;
          }
          .mx-auto {
            display:inline-block;
            margin-left:auto;
          }
      
          .label {
            font-weight: bold;
          }
          .text-label {
            width:100px;
          }
      
          .token {
            font-size: 40px;
            font-weight: bold;
            line-height:0.9;
          }

          .token-adjustment {
            margin-bottom:10px;
          }
      
          .section {
            margin-top: 6px;
          }
      
          .solid {
            border-top: 2px solid #000;
            margin: 8px 0;
          }
      
          .paid {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
          }
      
          .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 13px;
          }
          
          .capitalize {
            text-transform: capitalize;
          }
        </style>
      </head>
      
      <body onload="setTimeout(() => window.print(), 300)">
      <script>
        window.onafterprint = () => window.close();
      </script>
      
      <div class="receipt">
      
        <div class="center clinic">
          ABC MEDICAL CENTER
        </div>
      
        <div class="center branch">
          XYZ Branch
        </div>
      
        <div class="dotted"></div>
      
        <div class="center">
          ${new Date().toLocaleDateString()} &nbsp;&nbsp;
          ${new Date().toLocaleTimeString()}
        </div>
      
        <div class="section row">
          <div class="text-label token-adjustment">
            <div class="label">Token No</div>
            <div class="token">${modifyTokenNumber || 1}</div>
          </div>
      
          <div>
            <div class="label"> Doctor</div>
            <div class="capitalize">${doctor?.doctorName || values.doctor}</div>
          </div>
        </div>
      
        <div class="section">
          <div class="row">
            <span class="label text-label">Patient</span>
            <span class="capitalize">${values.patient_name}</span>
          </div>
      
          <div class="row">
            <span class="label text-label">Gender</span>
            <span class="capitalize">${values.gender}</span>
          </div>
      
          <div class="row">
            <span class="label text-label">Age</span>
            <span class="capitalize">${values.age} yrs</span>
          </div>
      
          <div class="row">
            <span class="label text-label">Service</span>
            <span class="capitalize">${service?.serviceName || values.service}</span>
          </div>
        </div>
      
        <div class="dotted"></div>
      
        <div class="row">
          <span>Fee</span>
          <span class="mx-auto">Rs. ${values.fee}</span>
        </div>
      
        <div class="row">
          <span>Discount</span>
          <span class="mx-auto">Rs. ${values.discount}</span>
        </div>
      
        <div class="solid"></div>
      
        <div class="paid">
          <span>Paid</span>
          <span>Rs. ${values.total}</span>
        </div>
      
        <div class="solid"></div>
      
        <div class="footer">
          Visit: www.al-faiz.website
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
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Sync token from localStorage on mount
    useEffect(() => {
      const storedToken = localStorage.getItem('receipt_token');
      const tokenValue = storedToken ? parseInt(storedToken, 10) : 1;
      if (values.token !== tokenValue) {
        setFieldValue('token', tokenValue);
      }
    }, []);

    // Handle countdown timer
    useEffect(() => {
      if (showResetDialog && countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [showResetDialog, countdown]);

    const handleTokenDoubleClick = () => {
      setShowResetDialog(true);
      setCountdown(5);
    };

    const handleResetConfirm = () => {
      const resetToken = 1;
      localStorage.setItem('receipt_token', resetToken.toString());
      setFieldValue('token', resetToken);
      setShowResetDialog(false);
      setCountdown(3);
    };

    const handleResetCancel = () => {
      setShowResetDialog(false);
      setCountdown(3);
    };

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
    const calcTotal = values.fee - values.discount
    const total = calcTotal < 0 ? 0 : calcTotal;
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
        <div className="flex gap-3">
          <div className="flex-[0.8]">
            <TextInput name="patient_name" label="Patient Name" required />
          </div>
          <div className="flex-[0.2]">
            <NumberInput
              name="token"
              label="Token"
              readonly
              onDoubleClick={handleTokenDoubleClick}
            />
          </div>
        </div>
        <div className="flex gap-3">

          <SelectInput
            name="gender"
            label="Select Gender"
            placeholder="Select Gender"
            options={['male', 'female']}
            className='flex-4 capitalize'
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

        {/* Reset Token Confirmation Dialog */}
        {showResetDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Reset Token Number
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                ⚠️ Warning: This action is not reversible. The token number will be reset to 1.
              </p>
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Please wait <span className="font-bold text-primary">{countdown}</span> second{countdown !== 1 ? 's' : ''} before proceeding...
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleResetCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  disabled={countdown > 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {countdown > 0 ? `Wait ${countdown}s` : 'Yes, Proceed'}
                </button>
              </div>
            </div>
          </div>
        )}
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
