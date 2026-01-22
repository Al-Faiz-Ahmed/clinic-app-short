import api from "./axios";
import { localStorageUtils } from "@/utils/localStorage";

export interface Service {
  id: string;
  serviceName: string;
  createdAt: Date;
  fee: number;
}

export const serviceService = {
  fetchServices: async (): Promise<Service[]> => {
    try {
      const response = await api.get("/service");
      const services = response.data?.data || [];
      localStorageUtils.services.set(services);
      return services;
    } catch (error) {
      // Fallback to localStorage if API fails
      return localStorageUtils.services.get();
    }
  },

  createService: async (service: Pick<Service, "serviceName"|"fee">): Promise<Service> => {
    const response = await api.post("/service", service);
    const newService = response.data?.data || service;

    // Update localStorage
    localStorageUtils.services.add(newService);

    return newService;
  },

  getServicesFromStorage: (): Service[] => {
    return localStorageUtils.services.get();
  },

  getServiceById: (id: string): Service | undefined => {
    const services = localStorageUtils.services.get();
    return services.find((s) => s.id === id || s.name === id);
  },
};
