const STORAGE_KEYS = {
  doctors: 'doctors',
  services: 'services',
} as const;

export const localStorageUtils = {
  doctors: {
    get: (): any[] => {
      const data = localStorage.getItem(STORAGE_KEYS.doctors);
      return data ? JSON.parse(data) : [];
    },
    set: (data: any[]): void => {
      localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(data));
    },
    add: (item: any): void => {
      const current = localStorageUtils.doctors.get();
      current.push(item);
      localStorageUtils.doctors.set(current);
    },
  },
  services: {
    get: (): any[] => {
      const data = localStorage.getItem(STORAGE_KEYS.services);
      return data ? JSON.parse(data) : [];
    },
    set: (data: any[]): void => {
      localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(data));
    },
    add: (item: any): void => {
      const current = localStorageUtils.services.get();
      current.push(item);
      localStorageUtils.services.set(current);
    },
  },
};
