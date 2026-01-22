import { z } from 'zod';

export const receiptSchema = z.object({
  doctor: z.string().min(1, 'Doctor is required'),
  service: z.string().min(1, 'Service is required'),
  patient_name: z.string().min(1, 'Patient name is required'),
  gender: z.enum(['male', 'female',""],"Gender is Required"),
  age: z.number().min(0, 'Age must be 0 or greater'),
  fee: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(1),
  token: z.number().min(1),
}).refine((data) => data.discount <= data.fee, {
  message: 'Discount cannot exceed fee',
  path: ['discount'],
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;
