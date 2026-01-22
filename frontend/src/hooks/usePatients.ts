import { useState, useEffect, useCallback } from 'react';
import { patientService } from '@/services/patient.service';
import type { PatientRow, PatientFilters, PaginationMeta, PatientTableStats } from '@/components/patient/types';

interface UsePatientsReturn {
  data: PatientRow[];
  loading: boolean;
  error: Error | null;
  pagination: PaginationMeta;
  stats: PatientTableStats;
  filters: PatientFilters;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: PatientFilters) => void;
  refetch: () => Promise<void>;
}

const getTodayDateRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  return {
    from_date: today.toISOString(),
    to_date: todayEnd.toISOString(),
  };
};

export const usePatients = (initialLimit: number = 20): UsePatientsReturn => {
  const [data, setData] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<PatientFilters>(() => getTodayDateRange());
  const [stats, setStats] = useState<PatientTableStats>({
    totalPatientVisitsToday: 0,
    totalTodaySales: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsResponse, statsResponse] = await Promise.all([
        patientService.fetchPatients(filters, page, limit),
        patientService.fetchStats(filters),
      ]);

      setData(patientsResponse.data);
      setStats(statsResponse);
      
      // Update pagination
      setPagination({
        page: patientsResponse.page,
        limit: patientsResponse.limit,
        total: patientsResponse.total,
        totalPages: patientsResponse.totalPages || Math.ceil(patientsResponse.total / patientsResponse.limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch patients'));
      setData([]);
      setStats({
        totalPatientVisitsToday: 0,
        totalTodaySales: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  const handleSetFilters = useCallback((newFilters: PatientFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    stats,
    filters,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setFilters: handleSetFilters,
    refetch,
  };
};
