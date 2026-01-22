import { useState, useEffect, type FocusEvent, type MouseEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { doctorService, type Doctor } from '@/services/doctor.service';
import { serviceService, type Service } from '@/services/service.service';
import type { PatientFilters } from './types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface PatientFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PatientFilters;
  onApply: (filters: PatientFilters) => void;
}

const getTodayDateRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const todayString = `${year}-${month}-${day}`;

  return {
    from_date: todayString,
    to_date: todayString,
  };
};

const formatDateForInput = (value: string | undefined) => {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const buildFiltersWithDefaultDates = (filters?: PatientFilters) => {
  const todayRange = getTodayDateRange();
  const base = filters ?? {};

  return {
    ...base,
    from_date: formatDateForInput(base.from_date) ?? todayRange.from_date,
    to_date: formatDateForInput(base.to_date) ?? todayRange.to_date,
  } as PatientFilters;
};

const formatDateForApi = (dateString: string | undefined, boundary: 'start' | 'end') => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return undefined;

  if (boundary === 'start') {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const microseconds = `${String(date.getMilliseconds()).padStart(3, '0')}000`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
};

export const PatientFiltersModal = ({
  open,
  onOpenChange,
  filters: initialFilters,
  onApply,
}: PatientFiltersModalProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [localFilters, setLocalFilters] = useState<PatientFilters>(() =>
    buildFiltersWithDefaultDates(initialFilters)
  );

  useEffect(() => {
    // Load doctors and services
    setDoctors(doctorService.getDoctorsFromStorage());
    setServices(serviceService.getServicesFromStorage());
  }, []);

  useEffect(() => {
    // Reset to initial filters when modal opens
    if (open) {
      setLocalFilters(buildFiltersWithDefaultDates(initialFilters));
    }
  }, [open, initialFilters]);

  const openNativeDatePicker = (
    event: MouseEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) => {
    if (typeof event.currentTarget.showPicker === 'function') {
      event.currentTarget.showPicker();
    }
  };

  const todayDateString = getTodayDateRange().from_date;

  const handleApply = () => {
    // Convert date format to ISO string with proper times
    const filtersToApply: PatientFilters = {
      ...localFilters,
      from_date: formatDateForApi(localFilters.from_date, 'start'),
      to_date: formatDateForApi(localFilters.to_date, 'end'),
    };
    onApply(filtersToApply);
    onOpenChange(false);
  };

  const handleClear = () => {
    const defaultFilters = getTodayDateRange();
    setLocalFilters(defaultFilters);
  };

  const handleReset = () => {
    const defaultFilters = getTodayDateRange();
    setLocalFilters(defaultFilters);
    onApply({
      from_date: formatDateForApi(defaultFilters.from_date, 'start'),
      to_date: formatDateForApi(defaultFilters.to_date, 'end'),
    });
    onOpenChange(false);
  };

  const toggleDoctor = (doctorId: string) => {
    setLocalFilters((prev) => {
      const currentIds = prev.doctor_ids || [];
      const newIds = currentIds.includes(doctorId)
        ? currentIds.filter((id) => id !== doctorId)
        : [...currentIds, doctorId];
      return { ...prev, doctor_ids: newIds.length > 0 ? newIds : undefined };
    });
  };

  const removeDoctor = (doctorId: string) => {
    setLocalFilters((prev) => {
      const currentIds = prev.doctor_ids || [];
      const newIds = currentIds.filter((id) => id !== doctorId);
      return { ...prev, doctor_ids: newIds.length > 0 ? newIds : undefined };
    });
  };

  const toggleService = (serviceId: string) => {
    setLocalFilters((prev) => {
      const currentIds = prev.service_ids || [];
      const newIds = currentIds.includes(serviceId)
        ? currentIds.filter((id) => id !== serviceId)
        : [...currentIds, serviceId];
      return { ...prev, service_ids: newIds.length > 0 ? newIds : undefined };
    });
  };

  const removeService = (serviceId: string) => {
    setLocalFilters((prev) => {
      const currentIds = prev.service_ids || [];
      const newIds = currentIds.filter((id) => id !== serviceId);
      return { ...prev, service_ids: newIds.length > 0 ? newIds : undefined };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Filter Patients</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Date Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Input
                  type="date"
                  value={localFilters.from_date || ''}
                  max={todayDateString}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, from_date: e.target.value }))
                  }
                  onClick={openNativeDatePicker}
                  onFocus={openNativeDatePicker}
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Input
                  type="date"
                  value={localFilters.to_date || ''}
                  max={todayDateString}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, to_date: e.target.value }))
                  }
                  onClick={openNativeDatePicker}
                  onFocus={openNativeDatePicker}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Doctors Multi-Select */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Doctors</label>
            <Select
              value="placeholder"
              onValueChange={(value) => {
                if (value !== "placeholder" && !localFilters.doctor_ids?.includes(value)) {
                  toggleDoctor(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>
                  Select doctors
                </SelectItem>
                {doctors
                  .filter((doctor) => !localFilters.doctor_ids?.includes(doctor.id))
                  .map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id} className='capitalize'>
                      {doctor.doctorName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {/* Selected Doctors */}
            {localFilters.doctor_ids && localFilters.doctor_ids.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.doctor_ids.map((doctorId) => {
                  const doctor = doctors.find((d) => d.id === doctorId);
                  if (!doctor) return null;
                  return (
                    <div
                      key={doctorId}
                      className="capitalize flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span>{doctor.doctorName}</span>
                      <button
                        onClick={() => removeDoctor(doctorId)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services Multi-Select */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Services</label>
            <Select
              value="placeholder"
              onValueChange={(value) => {
                if (value !== "placeholder" && !localFilters.service_ids?.includes(value)) {
                  toggleService(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>
                  Select services
                </SelectItem>
                {services
                  .filter((service) => !localFilters.service_ids?.includes(service.id))
                  .map((service) => (
                    <SelectItem key={service.id} value={service.id} className='capitalize'>
                      {service.serviceName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {/* Selected Services */}
            {localFilters.service_ids && localFilters.service_ids.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.service_ids.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  if (!service) return null;
                  return (
                    <div
                      key={serviceId}
                      className="capitalize flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span>{service.serviceName}</span>
                      <button
                        onClick={() => removeService(serviceId)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Patient Name */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Patient Name (min 3 characters)</label>
            <Input
              type="text"
              value={localFilters.patient_name || ''}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, patient_name: e.target.value }))
              }
              placeholder="Enter patient name"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Gender</label>
            <Select
              value={localFilters.gender || ''}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  gender: value === "clear" ? undefined : (value ? (value as "male" | "female" | "other") : undefined),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="clear">Clear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Age Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fixed Age</label>
                <Input
                  type="number"
                  min="0"
                  value={localFilters.fixed_age || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      fixed_age: e.target.value ? Number(e.target.value) : undefined,
                      min_age: undefined,
                      max_age: undefined,
                    }))
                  }
                  placeholder="Enter exact age"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Age</label>
                  <Input
                    type="number"
                    min="0"
                    value={localFilters.min_age || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        min_age: e.target.value ? Number(e.target.value) : undefined,
                        fixed_age: undefined,
                      }))
                    }
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Age</label>
                  <Input
                    type="number"
                    min="0"
                    value={localFilters.max_age || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        max_age: e.target.value ? Number(e.target.value) : undefined,
                        fixed_age: undefined,
                      }))
                    }
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset to Today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
