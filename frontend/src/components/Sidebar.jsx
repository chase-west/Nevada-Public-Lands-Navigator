import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { clearSelectedParcel } from '../store/parcelsSlice';
import axios from 'axios';
import Accordion from './Accordion';
import { ImpactMeters } from './ImpactMeter';
import StakeholderChart from './StakeholderChart';

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar() {
  const dispatch = useDispatch();
  const { selectedParcel } = useSelector((state) => state.parcels);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

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

  if (!selectedParcel) {
    return (
      <div className="w-full lg:w-[480px] bg-white border-r border-nevada-200 p-8 overflow-y-auto max-h-64 lg:max-h-full scrollbar-modern">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nevada-900 mb-2 tracking-tight">
            Nevada Public Lands Navigator
          </h2>
          <p className="text-nevada-600 text-sm leading-relaxed">
            Interactive visualization of proposed federal land transfers across Nevada
          </p>
        </div>

        <div className="space-y-6">
          <div className="card-elevated animate-in">
            <h3 className="font-semibold text-lg mb-3 text-nevada-900">About This Project</h3>
            <p className="text-sm text-nevada-700 leading-relaxed">
              This tool provides an interactive view of proposed federal land transfers in
              Nevada, including data from the Northern Nevada Economic Development and
              Conservation Act.
            </p>
          </div>

          <div className="card border-2 border-nevada-900 animate-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-lg mb-4 text-nevada-900">Land Use Types</h3>
            <div className="space-y-3">
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Housing Development</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#4ECDC4] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Conservation</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#45B7D1] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Recreation</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#9B59B6] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Economic Development</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-nevada-900 text-white rounded-2xl animate-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm leading-relaxed opacity-90">
              Click on any parcel on the map to view detailed information about the proposed land transfer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[480px] bg-white border-r border-nevada-200 p-8 overflow-y-auto max-h-96 lg:max-h-full scrollbar-modern">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="section-header mb-1">Parcel Details</p>
          <h2 className="text-2xl font-bold text-nevada-900 tracking-tight">
            {selectedParcel.name}
          </h2>
        </div>
        <button
          onClick={() => dispatch(clearSelectedParcel())}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 border-nevada-200 text-nevada-600 hover:border-nevada-900 hover:text-nevada-900 transition-all duration-200 hover:rotate-90"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
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

              {/* Civic Actions */}
              {aiInsights.civic_actions && (
                <div className="animate-slide-up stagger-3">
                  <Accordion
                    title="Take Action"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3L12 9L18 11L12 13L10 19L8 13L2 11L8 9L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    }
                    defaultOpen={false}
                    variant="dark"
                  >
                  {(() => {
                    const actions = typeof aiInsights.civic_actions === 'string'
                      ? JSON.parse(aiInsights.civic_actions)
                      : aiInsights.civic_actions;
                    return (
                      <div className="space-y-4 text-sm">
                        {actions.representatives && (
                          <div>
                            <p className="font-semibold text-white mb-2">📞 Contact Your Representatives</p>
                            <p className="text-white/80 leading-relaxed">{actions.representatives}</p>
                          </div>
                        )}
                        {actions.how_to_comment && (
                          <div>
                            <p className="font-semibold text-white mb-2">💬 How to Comment</p>
                            <p className="text-white/80 leading-relaxed">{actions.how_to_comment}</p>
                          </div>
                        )}
                        {actions.organizations && (
                          <div>
                            <p className="font-semibold text-white mb-2">🤝 Organizations</p>
                            <p className="text-white/80 leading-relaxed">{actions.organizations}</p>
                          </div>
                        )}
                        {actions.next_steps && (
                          <div className="bg-white/10 p-4 rounded-xl -mx-2 border border-white/20">
                            <p className="font-semibold text-white mb-2">⚡ Next Steps</p>
                            <p className="text-white/80 leading-relaxed">{actions.next_steps}</p>
                          </div>
                        )}
                        <button className="btn-primary w-full mt-4 bg-white text-nevada-900 hover:bg-nevada-50">
                          Contact Your Representatives
                        </button>
                      </div>
                    );
                  })()}
                  </Accordion>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
