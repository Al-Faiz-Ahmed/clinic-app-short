import api from './axios';
import { localStorageUtils } from '@/utils/localStorage';

export interface Doctor {
    id: string;
    doctorName: string;
    createdAt: Date;
}

export const doctorService = {
  fetchDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await api.get('/doctor');
      const doctors = response.data?.data || [];
      localStorageUtils.doctors.set(doctors);
      return doctors;
    } catch (error) {
      // Fallback to localStorage if API fails
      return localStorageUtils.doctors.get();
    }
  },

  createDoctor: async (doctor: Pick<Doctor, "doctorName">): Promise<Doctor> => {
    const response = await api.post('/doctor', doctor);
    const newDoctor = response.data?.data || doctor;
    
    // Update localStorage
    localStorageUtils.doctors.add(newDoctor);
    
    return newDoctor;
  },

  getDoctorsFromStorage: (): Doctor[] => {
    return localStorageUtils.doctors.get();
  },
};
