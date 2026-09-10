import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SnackBarMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface FlutterSnackBarProps {
  snackBars: SnackBarMessage[];
  onDismiss: (id: string) => void;
}

/**
 * Flutter ScaffoldMessenger SnackBar simulation
 * Demonstrates: SnackBar with action button, dismissible timer, Material 3 floating style
 */
export const FlutterSnackBar: React.FC<FlutterSnackBarProps> = ({
  snackBars,
  onDismiss,
}) => {
  return (
    <div
      id="flutter-snackbar-container"
      className="absolute bottom-16 inset-x-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence>
        {snackBars.map((snack) => (
          <SnackBarItem key={snack.id} snack={snack} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const SnackBarItem: React.FC<{
  snack: SnackBarMessage;
  onDismiss: (id: string) => void;
}> = ({ snack, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(snack.id);
    }, snack.durationMs || 4000);
    return () => clearTimeout(timer);
  }, [snack, onDismiss]);

  const getIcon = () => {
    switch (snack.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-xl border border-stone-800 text-xs font-medium max-w-md mx-auto w-full"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {getIcon()}
        <span className="truncate">{snack.message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {snack.actionLabel && (
          <button
            type="button"
            onClick={() => {
              snack.onAction?.();
              onDismiss(snack.id);
            }}
            className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer"
          >
            {snack.actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={() => onDismiss(snack.id)}
          className="p-1 text-stone-400 hover:text-white rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
