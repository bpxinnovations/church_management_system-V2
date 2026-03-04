'use client';

import { ReactNode, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Max width of the drawer panel (default: 28rem) */
  width?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 'md',
  showCloseButton = true,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel - slide from right */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl flex flex-col',
          widthClasses[width]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between shrink-0 px-6 py-4 border-b border-gray-200">
          <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 shrink-0"
              aria-label="Close"
            >
              <HiX className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
