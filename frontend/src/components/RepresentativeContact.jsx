import { useMemo, useState } from 'react';

// Nevada Congressional Representatives (2025 data - update as needed)
// All Nevada counties share the same 2 Senators
const NEVADA_SENATORS = [
  {
    name: 'Catherine Cortez Masto',
    party: 'Democrat',
    email: 'https://www.cortezmasto.senate.gov/contact',
    phone: '(202) 224-3542',
    image: '👤',
  },
  {
    name: 'Jacky Rosen',
    party: 'Democrat',
    email: 'https://www.rosen.senate.gov/email-jacky/',
    phone: '(202) 224-6244',
    image: '👤',
  },
];

const NEVADA_REPRESENTATIVES = {
  // District 2 - Northern Nevada (Washoe, Douglas, Lyon, Churchill, Storey, Carson City, Elko, Eureka, Humboldt, Lander, Pershing, White Pine, most of Lincoln)
  'Washoe': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Douglas': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Lyon': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Churchill': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Storey': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Carson City': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Elko': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Eureka': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Humboldt': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Lander': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Pershing': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'White Pine': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  // District 1 - Eastern Clark County (parts of Las Vegas, Henderson, Paradise, Boulder City)
  // Note: Clark County is split among districts 1, 3, and 4
  // Using District 1 (Dina Titus) as default for Clark County
  'Clark': {
    house: {
      name: 'Dina Titus',
      district: 'NV-01',
      party: 'Democrat',
      email: 'https://titus.house.gov/contact',
      phone: '(202) 225-5965',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  // District 4 - Central Nevada (Esmeralda, Mineral, Nye, Lincoln, parts of northern Clark County)
  'Esmeralda': {
    house: {
      name: 'Steven Horsford',
      district: 'NV-04',
      party: 'Democrat',
      email: 'https://horsford.house.gov/contact',
      phone: '(202) 225-9894',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Mineral': {
    house: {
      name: 'Steven Horsford',
      district: 'NV-04',
      party: 'Democrat',
      email: 'https://horsford.house.gov/contact',
      phone: '(202) 225-9894',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Nye': {
    house: {
      name: 'Steven Horsford',
      district: 'NV-04',
      party: 'Democrat',
      email: 'https://horsford.house.gov/contact',
      phone: '(202) 225-9894',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  'Lincoln': {
    house: {
      name: 'Steven Horsford',
      district: 'NV-04',
      party: 'Democrat',
      email: 'https://horsford.house.gov/contact',
      phone: '(202) 225-9894',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
  // Default for any other counties (using District 2 as it covers most rural areas)
  'default': {
    house: {
      name: 'Mark Amodei',
      district: 'NV-02',
      party: 'Republican',
      email: 'https://amodei.house.gov/contact',
      phone: '(202) 225-6155',
      image: '👤',
    },
    senators: NEVADA_SENATORS,
  },
};

function RepresentativeContact({ parcel }) {
  const [emailTemplate, setEmailTemplate] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);

  const representatives = useMemo(() => {
    const county = parcel?.county || 'default';
    return NEVADA_REPRESENTATIVES[county] || NEVADA_REPRESENTATIVES['default'];
  }, [parcel]);

  const generateEmailTemplate = (rep) => {
    const subject = `Regarding ${parcel.bill_name || 'Federal Land Transfer'} - ${parcel.name}`;
    const body = `Dear ${rep.name.split(' ').pop()},

I am writing to you as your constituent to express my views on ${parcel.bill_name || 'the proposed federal land transfer'} (${parcel.bill_number || 'pending legislation'}) affecting ${parcel.name} in ${parcel.county} County, Nevada.

This proposal involves ${parseFloat(parcel.acres || 0).toLocaleString()} acres designated for ${parcel.use_type || 'development'}. As a Nevada resident, I believe this land transfer will have significant impacts on our community.

[Please add your personal comments here about how this affects you and your community]

I urge you to carefully consider the environmental, economic, and community impacts of this proposal when making your decision.

Thank you for your service and for considering my input on this important matter.

Sincerely,
[Your Name]
[Your Address]
[Your Phone Number]`;

    return { subject, body };
  };

  const handleShowTemplate = (rep) => {
    const template = generateEmailTemplate(rep);
    setEmailTemplate(template.body);
    setShowTemplate(true);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emailTemplate);
    // You could add a toast notification here
  };

  const allRepresentatives = [
    { ...representatives.house, type: 'House Representative' },
    ...representatives.senators.map((s) => ({ ...s, type: 'U.S. Senator' })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
          <path d="M3 8L10 2L17 8V17H12V12H8V17H3V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-lg font-bold text-white">Contact Your Representatives</h3>
      </div>

      <p className="text-sm text-white/80 leading-relaxed mb-4">
        Make your voice heard! Contact your elected officials about this proposed land transfer.
      </p>

      {/* Representatives Cards */}
      <div className="space-y-3">
        {allRepresentatives.map((rep, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                {rep.image}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-semibold text-white">{rep.name}</h4>
                    <p className="text-xs text-white/70">
                      {rep.type} {rep.district && `• ${rep.district}`} {rep.party && `• ${rep.party}`}
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {rep.email && (
                    <a
                      href={rep.email}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/20 text-white rounded-lg hover:bg-white hover:text-nevada-900 transition-all duration-200"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 3L6 6.5L11 3M2 10H10C10.5523 10 11 9.55228 11 9V3C11 2.44772 10.5523 2 10 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Email
                    </a>
                  )}

                  {rep.phone && (
                    <a
                      href={`tel:${rep.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/20 text-white rounded-lg hover:bg-white hover:text-nevada-900 transition-all duration-200"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 1H4.5L5.5 4L4 5C4.5 6.5 5.5 7.5 7 8L8 6.5L11 7.5V9.5C11 10.0523 10.5523 10.5 10 10.5C5.30558 10.5 1.5 6.69442 1.5 2C1.5 1.44772 1.94772 1 2.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {rep.phone}
                    </a>
                  )}

                  <button
                    onClick={() => handleShowTemplate(rep)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/20 text-white rounded-lg hover:bg-white hover:text-nevada-900 transition-all duration-200"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2H10M2 5H8M2 8H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Email Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email Template Modal */}
      {showTemplate && (
        <div className="card-elevated animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-nevada-900">Email Template</h4>
            <button
              onClick={() => setShowTemplate(false)}
              className="text-nevada-400 hover:text-nevada-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <textarea
            value={emailTemplate}
            onChange={(e) => setEmailTemplate(e.target.value)}
            className="input-modern w-full min-h-[300px] font-mono text-xs"
            placeholder="Your message..."
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleCopyTemplate}
              className="btn-primary flex-1"
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Copy Template
              </div>
            </button>
            <button
              onClick={() => setShowTemplate(false)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-nevada-600 mt-3">
            Tip: Customize this template with your personal story and concerns to make your message more impactful.
          </p>
        </div>
      )}

      {/* Additional Resources */}
      <div className="p-4 bg-white/10 rounded-xl border border-white/30">
        <p className="text-xs text-white/90 leading-relaxed">
          <span className="font-semibold text-white">💡 Pro Tip:</span> Personal stories and specific examples of how this land transfer affects you and your community are much more effective than generic messages.
        </p>
      </div>
    </div>
  );
}

export default RepresentativeContact;
