import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  fee: z.number().min(1, 'Fee must be at least 1'),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
