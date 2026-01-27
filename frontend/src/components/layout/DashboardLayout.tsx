import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  topSection: ReactNode[];
  bottomSection: ReactNode;
  className?: string;
}

export const DashboardLayout = ({
  topSection,
  bottomSection,
  className,
}: DashboardLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-muted/30', className)}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Top Section - 3 columns with vertical dividers */}
        <h2 className='font-sans text-center font-bold text-black text-3xl mb-3'>ABC MEDICAL CENTER</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 mb-6">
          {topSection.map((section, index) => (
            <div key={index} className="flex ">
              <div className="flex-1 px-4 lg:px-6 xl:px-8">
                {section}
              </div>
              {index < topSection.length - 1 && (
                <div className="hidden lg:block w-px bg-border mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-border my-8" />

        {/* Bottom Section */}
        <div className="max-w-full">{bottomSection}</div>
      </div>
    </div>
  );
};
