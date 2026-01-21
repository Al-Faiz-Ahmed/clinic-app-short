import { useState, useEffect } from 'react';
import { serviceService, type Service } from '@/services/service.service';

interface ServicesListProps {
  className?: string;
  refreshKey?: number;
}

export const ServicesList = ({ className, refreshKey }: ServicesListProps) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = () => {
      const servicesData = serviceService.getServicesFromStorage();
      setServices(servicesData);
    };
    loadServices();
  }, [refreshKey]);

  return (
    <div className={className}>
      <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
        {services.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No services added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add a service using the form above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50 max-h-[320px] overflow-y-auto">
            {services.map((service) => (
              <div
                key={service.id || service.serviceName}
                className="px-4 py-3 flex justify-between items-center hover:bg-muted/30 transition-colors"
              >
                <div className="text-sm text-foreground">
                  {service.serviceName}
                </div>
                <div className="text-sm text-foreground font-medium">
                  Rs.{service.fee}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
