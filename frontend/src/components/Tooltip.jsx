import { useState, useRef, useEffect } from 'react';

function Tooltip({ term, definition, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('top');
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Determine if tooltip should appear above or below
      if (triggerRect.top - tooltipRect.height < 20) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        className="border-b-2 border-dotted border-accent-blue text-accent-blue cursor-help transition-colors hover:text-nevada-900 hover:border-nevada-900"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children || term}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 px-4 py-3 bg-nevada-900 text-white text-sm rounded-xl shadow-hard border border-nevada-700 animate-scale-in ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
        >
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-xs text-white/90 leading-relaxed">{definition}</div>

          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-nevada-900 border-nevada-700 rotate-45 ${
              position === 'top' ? 'bottom-0 translate-y-1/2 border-r border-b' : 'top-0 -translate-y-1/2 border-l border-t'
            }`}
          />
        </div>
      )}
    </span>
  );
}

export default Tooltip;
