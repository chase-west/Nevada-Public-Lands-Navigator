import { useState, useEffect } from 'react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Nevada Public Lands Navigator",
    description: "Your tool for understanding proposed federal land transfers in Nevada and how they impact your community.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-accent-blue">
        <path d="M24 44C24 44 39 30 39 18C39 9.71573 32.2843 3 24 3C15.7157 3 9 9.71573 9 18C9 30 24 44 24 44Z" stroke="currentColor" strokeWidth="3"/>
        <circle cx="24" cy="18" r="6" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    title: "Explore the Interactive Map",
    description: "Click on any colored parcel to see detailed information about proposed land transfers. Use the search bar to find specific Nevada locations, or use filters to narrow your view.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#4ECDC4]">
        <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="3"/>
        <path d="M14 24L20 18L26 24L34 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="34" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "AI-Powered Analysis",
    description: "Get instant insights about environmental, economic, and community impacts. Our AI analyzes each parcel to help you understand what proposed changes mean for Nevada.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#9B59B6]">
        <path d="M24 6L28 18L40 22L28 26L24 38L20 26L8 22L20 18L24 6Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <circle cx="24" cy="22" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: "Take Action",
    description: "Learn about stakeholders, understand the legislative process, and contact your representatives directly to make your voice heard on issues that matter to your community.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#FF6B6B]">
        <path d="M24 24L30 18L36 24M24 24L24 40M24 24L18 18L12 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
];

function WelcomeTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // Delay showing the modal slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nevada-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-hard border-2 border-nevada-900 overflow-hidden animate-scale-in">
        {/* Progress Bar */}
        <div className="h-1.5 bg-nevada-100">
          <div
            className="h-full bg-accent-blue transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-nevada-50 to-nevada-100 border-2 border-nevada-200">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-nevada-900 text-center mb-3 sm:mb-4 tracking-tight">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-nevada-700 text-center leading-relaxed mb-6 sm:mb-8">
            {step.description}
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-accent-blue'
                    : 'w-2 bg-nevada-200 hover:bg-nevada-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handleSkip}
              className="btn-ghost text-nevada-600 hover:text-nevada-900 order-2 sm:order-1"
            >
              Skip Tutorial
            </button>

            <div className="flex gap-3 order-1 sm:order-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="btn-secondary flex-1 sm:flex-initial"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="hidden sm:inline">Back</span>
                  </div>
                </button>
              )}

              <button
                onClick={handleNext}
                className="btn-primary flex-1 sm:flex-initial"
              >
                <div className="flex items-center justify-center gap-2">
                  {isLastStep ? 'Get Started' : 'Next'}
                  {!isLastStep && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-nevada-400 hover:text-nevada-900 hover:bg-nevada-100 transition-all duration-200"
          aria-label="Close tutorial"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WelcomeTutorial;
