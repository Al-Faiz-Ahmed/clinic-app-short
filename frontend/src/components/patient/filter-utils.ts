import type { PatientFilters } from './types'

export const getTodayDateRange = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const todayString = `${year}-${month}-${day}`

  return {
    from_date: todayString,
    to_date: todayString,
  }
}

export const formatDateForInput = (value: string | undefined) => {
  if (!value) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const buildFiltersWithDefaultDates = (filters?: PatientFilters) => {
  const todayRange = getTodayDateRange()
  const base = filters ?? {}

  return {
    ...base,
    from_date: formatDateForInput(base.from_date) ?? todayRange.from_date,
    to_date: formatDateForInput(base.to_date) ?? todayRange.to_date,
  } as PatientFilters
}

export const formatDateForApi = (
  dateString: string | undefined,
  boundary: 'start' | 'end'
) => {
  if (!dateString) return undefined
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return undefined

  if (boundary === 'start') {
    date.setHours(0, 0, 0, 0)
  } else {
    date.setHours(23, 59, 59, 999)
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const microseconds = `${String(date.getMilliseconds()).padStart(3, '0')}000`

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`
}
