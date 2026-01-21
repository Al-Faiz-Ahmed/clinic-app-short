import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MedicalReceiptForm } from '@/forms/MedicalReceiptForm';
import { DoctorForm } from '@/forms/DoctorForm';
import { ServiceForm } from '@/forms/ServiceForm';
import { DoctorsList } from '@/components/lists/DoctorsList';
import { ServicesList } from '@/components/lists/ServicesList';
import { PatientTable } from '@/components/tables/PatientTable';
import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { serviceService } from '@/services/service.service';

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
              <h3 className="text-base font-bold text-foreground mb-3">
                Doctors List
              </h3>
              <DoctorsList refreshKey={refreshKey} />
            </div>
          </div>
        </div>,

        // Column 3: Service Form + Services List
        <div key="services" className="space-y-4">
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-6">
            <ServiceForm onSuccess={handleFormSuccess} />
            <div>
              <h3 className="text-base font-bold text-foreground mb-3">
                Services List
              </h3>
              <ServicesList refreshKey={refreshKey} />
            </div>
          </div>
        </div>,
      ]}
      bottomSection={
        <div className="bg-card border border-border/50 rounded-lg p-6">
          {/* <PatientTable /> */}
        </div>
      }
    />
  );
}
