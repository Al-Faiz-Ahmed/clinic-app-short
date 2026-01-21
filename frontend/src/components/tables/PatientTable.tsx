import { useState, useEffect } from 'react';
import { patientService, type Patient, type PatientFilters } from '@/services/patient.service';
import { TextInput } from '@/components/inputs/TextInput';
import { cn } from '@/lib/utils';

interface PatientTableProps {
  className?: string;
}

export const PatientTable = ({ className }: PatientTableProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<PatientFilters>({});
  const [total, setTotal] = useState(0);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.fetchPatients(filters);
      setPatients(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      setPatients([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const handleFilterChange = (key: keyof PatientFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filters */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-4">Patient Filters</h3>
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">From</label>
            <input
              type="date"
              value={filters.from_date || ''}
              onChange={(e) => handleFilterChange('from_date', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">To</label>
            <input
              type="date"
              value={filters.to_date || ''}
              onChange={(e) => handleFilterChange('to_date', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          {total > 0 && (
            <div className="ml-auto text-sm font-medium text-foreground">
              Total Patients {total}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Dr Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Patient Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Service
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Fee
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-muted-foreground">Loading patients...</div>
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">No patients found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your date filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors duration-150",
                      index % 2 === 0 && "bg-muted/20"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {/* {patient.} */}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.patient}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.age}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {/* {patient.service} */}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      {patient.fee}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      {patient.discount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground font-medium">
                      {patient.paid}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
