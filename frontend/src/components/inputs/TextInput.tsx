import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

export const TextInput = ({
  name,
  label,
  placeholder,
  required,
  className,
  inputClassName
}: TextInputProps) => {
  const [field, meta] = useField(name);

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
        placeholder={placeholder}
        aria-invalid={meta.touched && meta.error ? true : undefined}
        aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
        className={cn(
          'h-10 capitalize',
          inputClassName ,
          meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive'
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
