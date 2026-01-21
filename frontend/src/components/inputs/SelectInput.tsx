import { useField } from 'formik';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  name: string;
  label?: string;
  options: SelectOption[] | string[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const SelectInput = ({
  name,
  label,
  options,
  required,
  placeholder = 'Select an option',
  className,
}: SelectInputProps) => {
  const [field, meta] = useField(name);

  // Convert string array to option objects if needed
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        {...field}
        aria-invalid={meta.touched && meta.error ? true : undefined}
        aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <p id={`${name}-error`} className="text-xs text-destructive font-medium">
          {meta.error}
        </p>
      )}
    </div>
  );
};
