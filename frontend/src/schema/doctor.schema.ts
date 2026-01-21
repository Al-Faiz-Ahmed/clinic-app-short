import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(1, 'Doctor name is required'),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
