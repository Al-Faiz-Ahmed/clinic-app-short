import api from './axios';

export type Patient = {
    id: string;
    createdAt: Date;
    patient: string;
    doctorId: string;
    serviceId: string;
    token: number;
    age: number;
    gender: "male" | "female";
    discount: number;
    fee: number;
    paid: number;
}

export interface PatientFilters {
  from_date?: string;
  to_date?: string;
}

export interface PatientResponse {
  data: Patient[];
  total: number;
  page?: number;
  limit?: number;
}

export const patientService = {
  fetchPatients: async (
    filters?: PatientFilters,
    page: number = 1,
    limit: number = 100
  ): Promise<PatientResponse> => {
    const params: Record<string, any> = {
      page,
      limit,
      ...filters,
    };

    const response = await api.get('/patients', { params });
    
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      page: response.data?.page || page,
      limit: response.data?.limit || limit,
    };
  },
};
