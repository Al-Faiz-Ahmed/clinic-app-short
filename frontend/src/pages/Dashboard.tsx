import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MedicalReceiptForm } from '@/forms/MedicalReceiptForm';
import { DoctorForm } from '@/forms/DoctorForm';
import { ServiceForm } from '@/forms/ServiceForm';
import { DoctorsList } from '@/components/lists/DoctorsList';
import { ServicesList } from '@/components/lists/ServicesList';
import { PatientTable } from '@/components/patient/PatientTable';
import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { serviceService } from '@/services/service.service';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Load initial data
  useEffect(() => {
    doctorService.fetchDoctors().catch(() => {
      // Silently fail if API is not available
    });
    serviceService.fetchServices().catch(() => {
      // Silently fail if API is not available
    });
  }, []);

  const handleFormSuccess = () => {
    // Trigger refresh of lists
    setRefreshKey((prev) => prev + 1);
  };

  const handleRefreshDoctors = async () => {
    try {
      await doctorService.fetchDoctors();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      // Error is already handled in the service
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleRefreshServices = async () => {
    try {
      await serviceService.fetchServices();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      // Error is already handled in the service
      setRefreshKey((prev) => prev + 1);
    }
  };

  return (
    <DashboardLayout
      topSection={[
        // Column 1: Medical Receipt Form
        <div key="receipt" className="space-y-4">
          <div className="bg-card border border-border/50 rounded-lg p-6">
            <MedicalReceiptForm onSuccess={handleFormSuccess} refreshKey={refreshKey} />
          </div>
        </div>,

        // Column 2: Doctor Form + Doctors List
        <div key="doctors" className="space-y-4">
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-6">
            <DoctorForm onSuccess={handleFormSuccess} />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-foreground">
                  Doctors List
                </h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRefreshDoctors}
                  title="Refresh doctors list"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <DoctorsList refreshKey={refreshKey} />
            </div>
          </div>
        </div>,

        // Column 3: Service Form + Services List
        <div key="services" className="space-y-4">
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-6">
            <ServiceForm onSuccess={handleFormSuccess} />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-foreground">
                  Services List
                </h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRefreshServices}
                  title="Refresh services list"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <ServicesList refreshKey={refreshKey} />
            </div>
          </div>
        </div>,
      ]}
      bottomSection={
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <PatientTable />
        </div>
      }
    />
  );
}
