import api from './axios';
import type { PatientFilters, PatientRow, PaginationMeta } from '@/components/patient/types';

export type Patient = {
    id: string;
    createdAt: Date;
    patient: string;
    doctorId: string;
    serviceId: string;
    token: number;
    age: number;
    gender: "male" | "female" | "other";
    discount: number;
    fee: number;
    paid: number;
}

export interface PatientResponse {
  data: PatientRow[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface PatientStatsResponse {
  totalPatientVisitsToday: number;
  totalTodaySales: number;
}

export const patientService = {
  fetchPatients: async (
    filters?: PatientFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<PatientResponse> => {
    const params: Record<string, any> = {
      page,
      limit,
    };

    // Only add active filters
    if (filters?.from_date) params.from_date = filters.from_date;
    if (filters?.to_date) params.to_date = filters.to_date;
    if (filters?.doctor_ids && filters.doctor_ids.length > 0) {
      params.doctor_ids = filters.doctor_ids.join(',');
    }
    if (filters?.service_ids && filters.service_ids.length > 0) {
      params.service_ids = filters.service_ids.join(',');
    }
    if (filters?.patient_name && filters.patient_name.length >= 3) {
      params.patient_name = filters.patient_name;
    }
    if (filters?.gender) {
      params.gender = filters.gender;
    }
    if (filters?.fixed_age !== undefined) {
      params.fixed_age = filters.fixed_age;
    }
    if (filters?.min_age !== undefined) {
      params.min_age = filters.min_age;
    }
    if (filters?.max_age !== undefined) {
      params.max_age = filters.max_age;
    }

    const response = await api.get('/patient', { params });
    // Backend returns { success: true, data: { data: [], total, page, limit, totalPages } }
    // Axios interceptor returns response as-is when success=true, so response.data is the envelope
    // Access response.data.data to get the inner data object
    const responseData = response.data?.data || {};
    const data = responseData?.data || [];
    const total = responseData?.total || 0;
    const currentPage = responseData?.page || page;
    const currentLimit = responseData?.limit || limit;
    const totalPages = responseData?.totalPages || Math.ceil(total / currentLimit);
    
    return {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
    };
  },

  fetchStats: async (filters?: PatientFilters): Promise<PatientStatsResponse> => {
    const params: Record<string, any> = {};

    // Only add date filters for stats
    if (filters?.from_date) params.from_date = filters.from_date;
    if (filters?.to_date) params.to_date = filters.to_date;

    try {
      const response = await api.get('/patient/stats', { params });
      return {
        totalPatientVisitsToday: response.data?.data?.totalPatientVisitsToday || 0,
        totalTodaySales: response.data?.data?.totalTodaySales || 0,
      };
    } catch (error) {
      // Fallback to calculating from current data if stats endpoint doesn't exist
      const patientResponse = await patientService.fetchPatients(filters, 1, 1000);
      const totalSales = patientResponse.data.reduce((sum, p) => sum + (p.paid || 0), 0);
      return {
        totalPatientVisitsToday: patientResponse.total,
        totalTodaySales: totalSales,
      };
    }
  },

  createPatient: async () => {
    
  }
};
