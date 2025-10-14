# Nevada Public Lands Navigator

A professional, full-stack web application that provides an interactive, map-based tool for exploring proposed federal land transfers in Nevada. This MVP automates data fetching from official government sources to ensure accuracy and scalability.

## Features

- **Interactive Map**: Full-screen, high-performance map centered on Nevada using Mapbox GL JS
- **Dynamic Data Layers**: Geospatial layers showing specific land parcels proposed for transfer
- **Information Panel**: Responsive sidebar displaying detailed parcel information
- **Legislative Integration**: Real-time data from Congress.gov API including bill status and details
- **Advanced Filtering**: Filter parcels by county, proposed use, or related legislation
- **Search Functionality**: Find locations and parcels quickly

## Technology Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **Mapbox GL JS** for mapping
- **Redux Toolkit** for state management

### Backend
- **Node.js** with Express
- **PostgreSQL** with PostGIS extension
- **Axios** for API requests

### APIs & Data Sources
- Bureau of Land Management (BLM) ArcGIS REST Services
- Congress.gov API
- Mapbox for basemap tiles

## Prerequisites

- Node.js (v20.19.0 or later recommended)
- PostgreSQL (v14 or later) with PostGIS extension
- Mapbox account and API token
- Congress.gov API key

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "The Nevada Public Lands Navigator"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nevada_lands
DB_USER=postgres
DB_PASSWORD=your_password

# API Keys
MAPBOX_TOKEN=your_mapbox_token
CONGRESS_API_KEY=your_congress_api_key

# BLM API
BLM_API_BASE_URL=https://gis.blm.gov/arcgis/rest/services
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE nevada_lands;
\c nevada_lands
CREATE EXTENSION postgis;
\q
```

Run the database schema:

```bash
psql -U postgres -d nevada_lands -f src/config/schema.sql
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Data Ingestion

### Ingest Legislative Data from Congress.gov

```bash
cd backend
npm run ingest:congress
```

### Ingest Geospatial Data from BLM

```bash
npm run ingest:blm
```

## API Endpoints

### Parcels
- `GET /api/parcels` - Get all parcels (with optional filters)
  - Query params: `county`, `bill_id`, `use_type`, `bounds`
- `GET /api/parcels/:id` - Get a specific parcel

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get a specific bill with its parcels

### Health Check
- `GET /api/health` - Check API status

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── schema.sql
│   │   ├── routes/
│   │   │   ├── parcels.js
│   │   │   └── bills.js
│   │   ├── scripts/
│   │   │   ├── ingestBLMData.js
│   │   │   └── ingestCongressData.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Filters.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── parcelsSlice.js
│   │   │   ├── billsSlice.js
│   │   │   └── mapSlice.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Development Workflow

1. **Backend Development**: All backend code is in the `backend/` directory
2. **Frontend Development**: All frontend code is in the `frontend/` directory
3. **Database Migrations**: Update `backend/src/config/schema.sql` and rerun
4. **API Integration**: Backend scripts in `backend/src/scripts/` handle data ingestion

## Deployment

### Backend Deployment (Heroku/Railway/AWS)

1. Set environment variables
2. Deploy the `backend` directory
3. Run database migrations
4. Run data ingestion scripts

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `frontend/dist` directory
3. Set environment variables for API URL and Mapbox token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Bureau of Land Management for geospatial data
- Congress.gov for legislative information
- Mapbox for mapping infrastructure

---

**Note**: This is an MVP (Minimum Viable Product). Future enhancements may include:
- Advanced search with geocoding
- User authentication and saved locations
- Export functionality (PDF reports, GeoJSON)
- Mobile responsive design improvements
- Real-time legislative updates via webhooks
- Natural language processing for automated bill-to-parcel linking
