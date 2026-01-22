export interface PatientRow {
  id: string;
  createdAt: Date;
  patient: string;
  doctorId: string;
  serviceId: string;
  doctorName?: string;
  serviceName?: string;
  token: number;
  age: number;
  gender: "male" | "female" | "other";
  discount: number;
  fee: number;
  paid: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PatientFilters {
  from_date?: string;
  to_date?: string;
  doctor_ids?: string[];
  service_ids?: string[];
  patient_name?: string;
  gender?: "male" | "female" | "other";
  fixed_age?: number;
  min_age?: number;
  max_age?: number;
}

export interface PatientTableStats {
  totalPatientVisitsToday: number;
  totalTodaySales: number;
}
