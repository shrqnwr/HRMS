import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Card Components ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => (
  <div 
    className={`bg-white rounded-[24px] border border-[#e0e0e0] shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] ${noPadding ? '' : 'p-6'} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: LucideIcon; color?: string }> = ({ title, value, trend, icon: Icon, color = 'blue' }) => {
  // Google Palette
  const colors: Record<string, string> = {
    blue: 'bg-[#e8f0fe] text-[#1967d2]',
    green: 'bg-[#e6f4ea] text-[#137333]',
    purple: 'bg-[#f3e8fd] text-[#9334e6]',
    orange: 'bg-[#feefe3] text-[#ea8600]',
    red: 'bg-[#fce8e6] text-[#c5221f]',
  };

  return (
    <Card className="flex items-center space-x-4 border-none shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`p-4 rounded-2xl ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-[#5f6368] font-medium tracking-wide">{title}</p>
        <h3 className="text-2xl font-google-sans font-medium text-[#202124] mt-1">{value}</h3>
        {trend && <p className="text-xs text-[#137333] font-medium mt-1 flex items-center">{trend}</p>}
      </div>
    </Card>
  );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-google-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Material 3 Styles
  const variants = {
    primary: "bg-[#1a73e8] text-white hover:bg-[#1557b0] hover:shadow-md shadow-sm border border-transparent active:bg-[#174ea6] focus:ring-[#1a73e8]",
    secondary: "bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc] border border-transparent focus:ring-[#1a73e8]",
    outline: "bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa] hover:border-[#dadce0] focus:ring-[#dadce0]",
    danger: "bg-[#d93025] text-white hover:bg-[#b31412] shadow-sm hover:shadow-md focus:ring-[#d93025]",
    ghost: "bg-transparent text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
  };
  
  const sizes = {
    sm: "px-4 py-1.5 text-xs rounded-full",
    md: "px-6 py-2.5 text-sm rounded-full",
    lg: "px-8 py-3 text-base rounded-full",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Badge Component ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: 'bg-[#e6f4ea] text-[#137333]',
    yellow: 'bg-[#fef7e0] text-[#b06000]', // Darker yellow text for contrast
    red: 'bg-[#fce8e6] text-[#c5221f]',
    blue: 'bg-[#e8f0fe] text-[#1967d2]',
    gray: 'bg-[#f1f3f4] text-[#3c4043]',
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide ${colors[color]}`}>{children}</span>;
};

// --- Layout Components ---
export const SectionHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
    <div>
      <h2 className="text-[28px] font-google-sans leading-9 text-[#202124]">{title}</h2>
      {description && <p className="mt-2 text-[15px] text-[#5f6368]">{description}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    'full': 'sm:max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-[#202124] bg-opacity-40 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`inline-block align-middle bg-white rounded-[28px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 w-full ${sizeClasses[size]} border border-[#dadce0]`}>
          <div className="bg-white px-8 pt-8 pb-6">
            <h3 className="text-2xl font-google-sans text-[#202124] mb-6" id="modal-title">{title}</h3>
            <div className="mt-2 text-[#3c4043]">{children}</div>
          </div>
          <div className="bg-[#f8f9fa] px-8 py-4 sm:flex sm:flex-row-reverse gap-3 border-t border-[#f1f3f4]">
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};