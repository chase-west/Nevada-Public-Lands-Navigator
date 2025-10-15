import { useState } from 'react';

function Accordion({ title, icon, children, defaultOpen = false, variant = 'default' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variants = {
    default: 'bg-white border-2 border-nevada-100',
    elevated: 'bg-white border-2 border-nevada-200 shadow-medium',
    dark: 'bg-nevada-900 border-2 border-nevada-900 text-white',
    accent: 'bg-accent-blue/5 border-2 border-accent-blue/20',
  };

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${variants[variant]} ${isOpen ? 'shadow-medium' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between transition-all duration-300 hover:bg-nevada-50/50 group"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`transition-all duration-300 ${variant === 'dark' ? 'text-white' : 'text-nevada-900'}`}>
              {icon}
            </div>
          )}
          <h3 className={`font-semibold text-base ${variant === 'dark' ? 'text-white' : 'text-nevada-900'}`}>
            {title}
          </h3>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} ${
            variant === 'dark' ? 'text-white' : 'text-nevada-600'
          }`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
