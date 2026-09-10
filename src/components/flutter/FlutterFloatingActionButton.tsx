import React from 'react';
import { Plus, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface FlutterFloatingActionButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick: () => void;
  isExtended?: boolean;
}

/**
 * Flutter FloatingActionButton / FloatingActionButton.extended simulation
 * Demonstrates: Material 3 floating action button with elevation, ripple, and extended pill mode
 */
export const FlutterFloatingActionButton: React.FC<FlutterFloatingActionButtonProps> = ({
  label = 'New Recipe',
  icon: Icon = Plus,
  onClick,
  isExtended = true,
}) => {
  return (
    <motion.button
      id="flutter-floating-action-btn"
      type="button"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-20 right-6 z-20 flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold shadow-lg shadow-amber-500/25 transition-colors cursor-pointer ${
        isExtended ? 'px-4 py-3 text-sm' : 'w-14 h-14'
      }`}
      title="Create new recipe (Form with validation)"
    >
      <Icon className="w-5 h-5 stroke-[2.5]" />
      {isExtended && <span>{label}</span>}
    </motion.button>
  );
};
