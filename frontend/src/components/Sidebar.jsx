import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { clearSelectedParcel } from '../store/parcelsSlice';
import { addToComparison } from '../store/comparisonSlice';
import axios from 'axios';
import Accordion from './Accordion';
import { ImpactMeters } from './ImpactMeter';
import StakeholderChart from './StakeholderChart';
import Dashboard from './Dashboard';
import RepresentativeContact from './RepresentativeContact';

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar({ mobileOpen, onMobileClose }) {
  const dispatch = useDispatch();
  const { selectedParcel } = useSelector((state) => state.parcels);
  const { parcels: comparisonParcels } = useSelector((state) => state.comparison);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAddToComparison = () => {
    dispatch(addToComparison(selectedParcel));
  };

  const isInComparison = selectedParcel && comparisonParcels.some(p => p.id === selectedParcel.id);
  const canAddToComparison = selectedParcel && !isInComparison && comparisonParcels.length < 3;

  // Fetch AI insights when parcel is selected
  useEffect(() => {
    if (selectedParcel && selectedParcel.id) {
      setLoadingAI(true);
      setAiError(null);
      setAiInsights(null);

      axios.get(`${API_URL}/ai/summary/${selectedParcel.id}`)
        .then(response => {
          setAiInsights(response.data);
          setLoadingAI(false);
        })
        .catch(error => {
          console.error('Error fetching AI insights:', error);
          setAiError('Failed to load AI insights');
          setLoadingAI(false);
        });
    } else {
      setAiInsights(null);
    }
  }, [selectedParcel]);

  // Shared classes for both states
  const baseClasses = "bg-white border-nevada-200 p-6 sm:p-8 overflow-y-auto scrollbar-modern";
  const desktopClasses = "lg:w-[480px] lg:h-full lg:border-r lg:relative";
  const mobileClasses = `
    fixed bottom-0 left-0 right-0 z-30
    lg:static
    transition-transform duration-300 ease-out
    ${mobileOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
    rounded-t-3xl lg:rounded-none
    border-t-4 lg:border-t-0
    shadow-[0_-4px_24px_rgba(0,0,0,0.15)] lg:shadow-none
    max-h-[85vh] lg:max-h-full
  `;

  if (!selectedParcel) {
    return (
      <>
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-20 transition-opacity duration-300"
            onClick={onMobileClose}
          />
        )}

        <div className={`${baseClasses} ${desktopClasses} ${mobileClasses}`}>
          {/* Mobile drag handle */}
          <div className="lg:hidden flex justify-center mb-4">
            <button
              onClick={onMobileClose}
              className="w-12 h-1.5 bg-nevada-300 rounded-full hover:bg-nevada-400 transition-colors"
              aria-label="Close sidebar"
            />
          </div>

          <Dashboard />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-20 transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <div className={`${baseClasses} ${desktopClasses} ${mobileClasses}`}>
        {/* Mobile drag handle */}
        <div className="lg:hidden flex justify-center mb-4">
          <button
            onClick={onMobileClose}
            className="w-12 h-1.5 bg-nevada-300 rounded-full hover:bg-nevada-400 transition-colors"
            aria-label="Close sidebar"
          />
        </div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="section-header mb-1">Parcel Details</p>
          <h2 className="text-2xl font-bold text-nevada-900 tracking-tight">
            {selectedParcel.name}
          </h2>
        </div>
        <div className="flex gap-2">
          {canAddToComparison && (
            <button
              onClick={handleAddToComparison}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-200"
              aria-label="Add to comparison"
              title="Add to comparison"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {isInComparison && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 border-green-500 bg-green-500 text-white"
              title="In comparison">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <button
            onClick={() => {
              dispatch(clearSelectedParcel());
              onMobileClose();
            }}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 border-nevada-200 text-nevada-600 hover:border-nevada-900 hover:text-nevada-900 transition-all duration-200 hover:rotate-90"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
              County
            </p>
            <p className="text-xl font-bold text-nevada-900">
              {selectedParcel.county}
            </p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
              Acreage
            </p>
            <p className="text-xl font-bold text-nevada-900">
              {parseFloat(selectedParcel.acres).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="card-elevated">
          <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
            Proposed Use
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border-2 border-nevada-900 flex-shrink-0"
              style={{
                backgroundColor:
                  selectedParcel.use_type === 'Housing Development' ? '#FF6B6B' :
                  selectedParcel.use_type === 'Conservation' ? '#4ECDC4' :
                  selectedParcel.use_type === 'Recreation' ? '#45B7D1' :
                  selectedParcel.use_type === 'Economic Development' ? '#9B59B6' :
                  '#95E1D3'
              }}
            ></div>
            <p className="text-lg font-semibold text-nevada-900">
              {selectedParcel.use_type || 'Not specified'}
            </p>
          </div>
        </div>

        {selectedParcel.description && (
          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Description
            </p>
            <p className="text-sm text-nevada-700 leading-relaxed">
              {selectedParcel.description}
            </p>
          </div>
        )}

        {selectedParcel.bill_name && (
          <div className="card border-2 border-accent-blue bg-accent-blue/5">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Related Legislation
            </p>
            <p className="text-lg font-bold text-nevada-900 mb-2">
              {selectedParcel.bill_name}
            </p>
            {selectedParcel.bill_number && (
              <p className="text-sm text-nevada-600 mb-3 font-mono">
                {selectedParcel.bill_number}
              </p>
            )}
            {selectedParcel.bill_status && (
              <div className="mb-3">
                <span className="badge badge-secondary">
                  {selectedParcel.bill_status}
                </span>
              </div>
            )}
            {selectedParcel.bill_url && (
              <a
                href={selectedParcel.bill_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-nevada-900 transition-colors group"
              >
                View on Congress.gov
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        )}

        {selectedParcel.township && selectedParcel.range && selectedParcel.section && (
          <div className="card bg-nevada-50">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Public Land Survey System
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-nevada-600 mb-1">Township</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.township}</p>
              </div>
              <div>
                <p className="text-nevada-600 mb-1">Range</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.range}</p>
              </div>
              <div>
                <p className="text-nevada-600 mb-1">Section</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.section}</p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="divider"></div>

        {/* AI Insights Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-nevada-900">
              <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-lg font-bold text-nevada-900">AI Analysis</h3>
          </div>

          {loadingAI && (
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="spinner"></div>
                <span className="text-sm text-nevada-600">Generating insights...</span>
              </div>
            </div>
          )}

          {aiError && (
            <div className="card border-2 border-red-200 bg-red-50">
              <p className="text-sm text-red-700">{aiError}</p>
            </div>
          )}

          {aiInsights && !loadingAI && (
            <>
              {/* Summary */}
              <div className="card-elevated animate-scale-in">
                <p className="section-header">What This Means</p>
                <p className="text-sm text-nevada-700 leading-relaxed">
                  {aiInsights.summary}
                </p>
              </div>

              {/* Impact Analysis with Visual Meters */}
              {aiInsights.impact_analysis && (
                <div className="animate-slide-up stagger-1">
                  <Accordion
                    title="Impact Analysis"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3V17M10 17L15 12M10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                      </svg>
                    }
                    defaultOpen={true}
                    variant="elevated"
                  >
                  {(() => {
                    const impacts = typeof aiInsights.impact_analysis === 'string'
                      ? JSON.parse(aiInsights.impact_analysis)
                      : aiInsights.impact_analysis;
                    return (
                      <>
                        {/* Visual Impact Meters */}
                        <div className="mb-6">
                          <ImpactMeters impacts={impacts} />
                        </div>

                        {/* Detailed Text */}
                        <div className="space-y-4 text-sm text-nevada-700 pt-4 border-t border-nevada-200">
                          {impacts.environmental && (
                            <div className="p-4 bg-[#4ECDC4]/5 rounded-xl border border-[#4ECDC4]/20">
                              <p className="font-semibold text-nevada-900 mb-2">🌲 Environmental</p>
                              <p className="leading-relaxed">{impacts.environmental}</p>
                            </div>
                          )}
                          {impacts.economic && (
                            <div className="p-4 bg-[#45B7D1]/5 rounded-xl border border-[#45B7D1]/20">
                              <p className="font-semibold text-nevada-900 mb-2">💰 Economic</p>
                              <p className="leading-relaxed">{impacts.economic}</p>
                            </div>
                          )}
                          {impacts.community && (
                            <div className="p-4 bg-[#9B59B6]/5 rounded-xl border border-[#9B59B6]/20">
                              <p className="font-semibold text-nevada-900 mb-2">👥 Community</p>
                              <p className="leading-relaxed">{impacts.community}</p>
                            </div>
                          )}
                          {impacts.cultural && impacts.cultural !== 'Not applicable' && (
                            <div className="p-4 bg-[#E67E22]/5 rounded-xl border border-[#E67E22]/20">
                              <p className="font-semibold text-nevada-900 mb-2">🏛️ Cultural/Historical</p>
                              <p className="leading-relaxed">{impacts.cultural}</p>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                  </Accordion>
                </div>
              )}

              {/* Stakeholders with Chart */}
              {aiInsights.stakeholders && (
                <div className="animate-slide-up stagger-2">
                  <Accordion
                    title="Key Stakeholders"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13 7C13 8.65685 11.6569 10 10 10C8.34315 10 7 8.65685 7 7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 16C5 13.7909 6.79086 12 9 12H11C13.2091 12 15 13.7909 15 16V17H5V16Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    }
                    defaultOpen={true}
                    variant="default"
                  >
                  {(() => {
                    const stakeholders = typeof aiInsights.stakeholders === 'string'
                      ? JSON.parse(aiInsights.stakeholders)
                      : aiInsights.stakeholders;
                    return (
                      <>
                        {/* Visual Chart */}
                        <div className="mb-6">
                          <StakeholderChart stakeholders={stakeholders} />
                        </div>

                        {/* Detailed Text */}
                        <div className="space-y-3 text-sm text-nevada-700 pt-4 border-t border-nevada-200">
                          {stakeholders.supporters && (
                            <div className="p-3 bg-[#4ECDC4]/5 rounded-xl border border-[#4ECDC4]/20">
                              <p className="font-semibold text-green-700 mb-2">✅ Likely Supporters</p>
                              <p className="leading-relaxed text-nevada-700">{stakeholders.supporters}</p>
                            </div>
                          )}
                          {stakeholders.opponents && (
                            <div className="p-3 bg-[#FF6B6B]/5 rounded-xl border border-[#FF6B6B]/20">
                              <p className="font-semibold text-red-700 mb-2">⚠️ Likely Opponents</p>
                              <p className="leading-relaxed text-nevada-700">{stakeholders.opponents}</p>
                            </div>
                          )}
                          {stakeholders.neutral && (
                            <div className="p-3 bg-nevada-50 rounded-xl border border-nevada-200">
                              <p className="font-semibold text-nevada-900 mb-2">⚖️ Mixed Interests</p>
                              <p className="leading-relaxed text-nevada-700">{stakeholders.neutral}</p>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                  </Accordion>
                </div>
              )}

              {/* Take Action - Always show, representative contact first */}
              <div className="animate-slide-up stagger-3">
                <Accordion
                  title="Take Action"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3L12 9L18 11L12 13L10 19L8 13L2 11L8 9L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  }
                  defaultOpen={true}
                  variant="dark"
                >
                  <div className="space-y-6">
                    {/* Representative Contact Component - FIRST */}
                    <RepresentativeContact parcel={selectedParcel} />

                    {/* AI Insights about civic actions - Collapsed by default */}
                    {aiInsights?.civic_actions && (() => {
                      const actions = typeof aiInsights.civic_actions === 'string'
                        ? JSON.parse(aiInsights.civic_actions)
                        : aiInsights.civic_actions;
                      return (
                        <details className="group">
                          <summary className="cursor-pointer bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all list-none">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white text-sm">📋 Additional Action Steps & Resources</span>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/70 transition-transform group-open:rotate-180">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </summary>
                          <div className="mt-4 space-y-4 text-sm">
                            {actions.how_to_comment && (
                              <div className="bg-white/5 p-4 rounded-xl border border-white/20">
                                <p className="font-semibold text-white mb-2">💬 How to Comment</p>
                                <p className="text-white/80 leading-relaxed text-xs">{actions.how_to_comment}</p>
                              </div>
                            )}
                            {actions.organizations && (
                              <div className="bg-white/5 p-4 rounded-xl border border-white/20">
                                <p className="font-semibold text-white mb-2">🤝 Organizations to Contact</p>
                                <p className="text-white/80 leading-relaxed text-xs">{actions.organizations}</p>
                              </div>
                            )}
                            {actions.next_steps && (
                              <div className="bg-white/10 p-4 rounded-xl border border-white/30">
                                <p className="font-semibold text-white mb-2">⚡ Detailed Next Steps</p>
                                <p className="text-white/80 leading-relaxed text-xs">{actions.next_steps}</p>
                              </div>
                            )}
                          </div>
                        </details>
                      );
                    })()}
                  </div>
                </Accordion>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default Sidebar;
