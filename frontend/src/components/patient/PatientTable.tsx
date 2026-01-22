import { useState } from 'react';
import { usePatients } from '@/hooks/usePatients';
import { PatientFiltersModal } from './PatientFiltersModal';
import { PatientPagination } from './PatientPagination';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { doctorService } from '@/services/doctor.service';
import { serviceService } from '@/services/service.service';
import type { PatientRow } from './types';

interface PatientTableProps {
  className?: string;
}

export const PatientTable = ({ className }: PatientTableProps) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const {
    data: patients,
    loading,
    pagination,
    stats,
    filters,
    setPage,
    setLimit,
    setFilters,
  } = usePatients(20);

  // Get doctor and service names for display
  const doctors = doctorService.getDoctorsFromStorage();
  const services = serviceService.getServicesFromStorage();

  const getDoctorName = (doctorId: string): string => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor?.doctorName || 'Unknown';
  };

  const getServiceName = (serviceId: string): string => {
    const service = services.find((s) => s.id === serviceId);
    return service?.serviceName || 'Unknown';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patient Visits</h2>
        </div>
        <div className="flex items-center gap-4">
          {/* Summary Stats */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Visits Today</p>
              <p className="text-lg font-semibold text-foreground">
                {stats.totalPatientVisitsToday}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Sales Today</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{stats.totalTodaySales.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setFilterModalOpen(true)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      <PatientFiltersModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApply={setFilters}
      />

      {/* Table */}
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Sr No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Gender
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Token
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Fee
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Paid
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <div className="text-muted-foreground">Loading patients...</div>
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">No patients found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => {
                  const srNo = (pagination.page - 1) * pagination.limit + index + 1;
                  return (
                    <tr
                      key={patient.id}
                      className={cn(
                        'hover:bg-muted/30 transition-colors duration-150',
                        index % 2 === 0 && 'bg-muted/20'
                      )}
                    >
                      <td className="px-4 py-3 text-sm text-foreground">{srNo}</td>
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {patient.doctorName || getDoctorName(patient.doctorId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {patient.patient}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {patient.serviceName || getServiceName(patient.serviceId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {patient.age}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {patient.gender}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">
                        {patient.token}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">
                        ₹{patient.fee.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">
                        ₹{patient.discount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground font-medium">
                        ₹{patient.paid.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && patients.length > 0 && (
          <PatientPagination
            pagination={pagination}
            loading={loading}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>
    </div>
  );
};
