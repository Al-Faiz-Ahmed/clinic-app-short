import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  readonly?: boolean;
  className?: string;
  onDoubleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export const NumberInput = ({
  name,
  label,
  placeholder,
  required,
  min,
  max,
  readonly = false,
  className,
  onDoubleClick,
}: NumberInputProps) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      helpers.setValue('');
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        helpers.setValue(min);
      } else if (max !== undefined && numValue > max) {
        helpers.setValue(max);
      } else {
        helpers.setValue(numValue);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Input
        id={name}
        {...field}
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        readOnly={readonly}
        onChange={handleChange}
        onDoubleClick={onDoubleClick}
        aria-invalid={meta.touched && meta.error ? true : undefined}
        aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
        className={cn(
          'h-10',
          meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive',
          readonly && 'bg-muted cursor-not-allowed'
        )}
      />
      {meta.touched && meta.error && (
        <p id={`${name}-error`} className="text-xs text-destructive font-medium">
          {meta.error}
        </p>
      )}
    </div>
  );
};
