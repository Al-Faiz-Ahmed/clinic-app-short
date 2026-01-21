import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className,
}: PrimaryButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant="default"
      className={className}
    >
      {children}
    </Button>
  );
};
