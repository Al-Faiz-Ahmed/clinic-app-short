import { useState, useEffect } from 'react';
import { doctorService, type Doctor } from '@/services/doctor.service';
import { cn } from '@/lib/utils';

interface DoctorsListProps {
  selectedDoctorId?: string;
  onSelect?: (doctor: Doctor) => void;
  className?: string;
  refreshKey?: number;
}

export const DoctorsList = ({
  selectedDoctorId,
  onSelect,
  className,
  refreshKey,
}: DoctorsListProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const loadDoctors = () => {
      const doctorsData = doctorService.getDoctorsFromStorage();
      setDoctors(doctorsData);
    };
    loadDoctors();
  }, [refreshKey]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
        {doctors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No doctors added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add a doctor using the form above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50 max-h-[320px] overflow-y-auto">
            {doctors.map((doctor) => {
              const isSelected =
                selectedDoctorId === doctor.id || selectedDoctorId === doctor.doctorName;
              return (
                <div
                  key={doctor.id || doctor.doctorName}
                  onClick={() => onSelect?.(doctor)}
                  className={cn(
                    'px-4 py-3 cursor-pointer transition-all duration-200',
                    'hover:bg-muted/50 active:bg-muted',
                    isSelected && 'bg-primary/10'
                  )}
                >
                  <div className="text-sm text-foreground">
                    {doctor.doctorName.startsWith('Dr.') ? doctor.doctorName : `Dr. ${doctor.doctorName}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
