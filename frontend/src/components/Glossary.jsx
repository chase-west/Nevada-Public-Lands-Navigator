import { useState } from 'react';

const GLOSSARY_TERMS = [
  {
    term: 'BLM (Bureau of Land Management)',
    definition: 'A federal agency within the U.S. Department of the Interior that manages public lands, primarily in western states including Nevada. BLM oversees 245 million acres of public land.',
    category: 'Agencies',
  },
  {
    term: 'Federal Land Transfer',
    definition: 'The process of transferring ownership or management of federal public lands to state, local, or private entities. These transfers require Congressional approval.',
    category: 'Land Management',
  },
  {
    term: 'Public Land Survey System (PLSS)',
    definition: 'A surveying method used to divide and describe land in the United States using townships, ranges, and sections. This system is used to precisely identify parcel locations.',
    category: 'Land Management',
  },
  {
    term: 'Township',
    definition: 'A unit of land measurement in the PLSS, approximately 36 square miles (6 miles × 6 miles), divided into 36 sections.',
    category: 'Land Management',
  },
  {
    term: 'Range',
    definition: 'In the PLSS, a vertical column of townships running north-south, numbered east or west from a principal meridian.',
    category: 'Land Management',
  },
  {
    term: 'Section',
    definition: 'A unit of land in the PLSS, approximately 1 square mile (640 acres), used to identify specific land parcels.',
    category: 'Land Management',
  },
  {
    term: 'Acre',
    definition: 'A unit of land area equal to 43,560 square feet or about 90% of a football field. Used to measure parcel sizes.',
    category: 'Land Management',
  },
  {
    term: 'Conservation',
    definition: 'Protection and preservation of natural resources and wildlife habitats. Conservation land use prioritizes environmental protection over development.',
    category: 'Land Use',
  },
  {
    term: 'Recreation Area',
    definition: 'Public land designated for outdoor activities such as hiking, camping, fishing, and wildlife viewing. These areas balance public access with environmental protection.',
    category: 'Land Use',
  },
  {
    term: 'Economic Development',
    definition: 'Land use focused on creating jobs and generating revenue through commercial or industrial activities. May include mining, energy production, or business parks.',
    category: 'Land Use',
  },
  {
    term: 'Housing Development',
    definition: 'Land designated for residential construction, including single-family homes, apartments, and related infrastructure.',
    category: 'Land Use',
  },
  {
    term: 'Congressional Bill',
    definition: 'A proposed law presented to Congress for consideration. Bills must pass both the House of Representatives and Senate, then be signed by the President to become law.',
    category: 'Legislative',
  },
  {
    term: 'Stakeholder',
    definition: 'Any person, group, or organization with an interest in or affected by a land transfer. Includes local communities, environmental groups, businesses, and government agencies.',
    category: 'Legislative',
  },
  {
    term: 'Environmental Impact',
    definition: 'The effect of land use changes on natural ecosystems, wildlife, water resources, air quality, and climate. Federal land transfers require environmental impact assessments.',
    category: 'Impact',
  },
  {
    term: 'Economic Impact',
    definition: 'The effect of land transfers on jobs, tax revenue, property values, and local economic activity. Can include both positive and negative effects.',
    category: 'Impact',
  },
  {
    term: 'Community Impact',
    definition: 'How land transfers affect local residents, including access to public lands, quality of life, cultural resources, and community character.',
    category: 'Impact',
  },
  {
    term: 'Northern Nevada Economic Development and Conservation Act',
    definition: 'Federal legislation proposing land transfers in northern Nevada to support economic growth while protecting conservation areas.',
    category: 'Legislative',
  },
  {
    term: 'Washoe County',
    definition: 'A county in northwestern Nevada that includes Reno, Sparks, and Lake Tahoe. Home to approximately 500,000 residents.',
    category: 'Geography',
  },
];

const CATEGORIES = ['All', ...new Set(GLOSSARY_TERMS.map(t => t.category))];

function Glossary({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nevada-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-hard border-2 border-nevada-900 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-nevada-900 text-white px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Glossary of Terms</h2>
              <p className="text-sm text-white/70">
                Understanding land management and legislative terminology
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:rotate-90"
              aria-label="Close glossary"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full px-4 py-3 pl-11 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all"
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
            >
              <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-white text-nevada-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-250px)] scrollbar-modern">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-nevada-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-nevada-400">
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10V16M16 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-nevada-600 font-medium">No terms found</p>
              <p className="text-sm text-nevada-500 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTerms.map((item, index) => (
                <div
                  key={index}
                  className="card hover:shadow-medium transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-nevada-900 text-base group-hover:text-accent-blue transition-colors">
                      {item.term}
                    </h3>
                    <span className="badge badge-secondary flex-shrink-0 ml-2">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-nevada-700 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-nevada-200 px-8 py-4 bg-nevada-50">
          <p className="text-xs text-nevada-600 text-center">
            Found {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
          </p>
        </div>
      </div>
    </div>
  );
}

export default Glossary;
