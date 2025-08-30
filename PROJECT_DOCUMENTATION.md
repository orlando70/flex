# Flex Project Documentation

## Tech Stack

### Frontend Framework
- **Next.js 15.5.2** - React-based full-stack framework with App Router
- **React 19.1.0** - Modern React with latest features and performance improvements
- **TypeScript 5** - Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Modern icon library for consistent iconography
- **Recharts** - Composable charting library for data visualization

### State Management & Data Fetching
- **@tanstack/react-query** - Powerful data synchronization library for React
- **@tanstack/react-query-devtools** - Development tools for debugging queries

### Database & Backend
- **MongoDB** - NoSQL document database for flexible data storage
- **Mongoose 8.18.0** - MongoDB object modeling for Node.js

### External APIs & Services
- **Google Maps API** - Location services and mapping functionality
- **Hostaway API** - Property management system integration
- **Google Places API** - Location and place information

### Development Tools
- **ESLint 9** - Code quality and consistency
- **PostCSS** - CSS processing and optimization

## Key Design and Logic Decisions

### React Query Implementation
The decision to use React Query was driven by several key advantages:

**Performance Benefits:**
- Automatic background refetching keeps data fresh
- Intelligent caching reduces unnecessary API calls
- Optimistic updates provide instant user feedback

**Developer Experience:**
- Built-in loading and error states
- Automatic retry logic for failed requests
- DevTools for debugging and monitoring

**Data Synchronization:**
- Real-time data synchronization across components
- Automatic garbage collection of unused queries
- Configurable stale time (currently set to 60 seconds)

### MongoDB Database Choice
MongoDB was selected for its flexibility and scalability:

**Schema Flexibility:**
- Dynamic schema evolution for review states
- Easy addition of new fields without migrations
- JSON-like document structure matches API responses

**Performance:**
- Indexed queries for fast review lookups
- Efficient filtering and aggregation
- Horizontal scaling capabilities

**Integration Benefits:**
- Native JSON support simplifies data transformation
- Mongoose provides type safety and validation
- Built-in timestamps for audit trails

### UI View Modes
The application provides two distinct viewing modes for enhanced user experience:

**Grid Mode:**
- Card-based layout optimized for visual browsing
- Property images and key information prominently displayed
- Responsive grid that adapts to screen sizes
- Hover effects and smooth transitions

**Table Mode:**
- Tabular format for data-heavy analysis
- Sortable columns for easy comparison
- Compact display of multiple properties
- Efficient use of horizontal space

### Review Visibility Toggle
The review system implements a sophisticated visibility control mechanism:

**User Control:**
- "Reviews" button toggles review visibility for each property
- Individual property review sections can be expanded/collapsed
- State persistence across view mode changes

**Admin Features:**
- Database-stored visibility states for each review
- Ability to hide inappropriate or problematic reviews
- Audit trail with timestamps and admin notes

### Property Navigation
Dynamic routing provides seamless property exploration:

**Card Click Navigation:**
- Clicking any property card redirects to `/property/[id]`
- Dynamic route generation for each property
- SEO-friendly URLs for better discoverability


## API Behaviors

### Listings API (`/api/listings`)
**Endpoint:** `GET /api/listings`
**Purpose:** Fetch property listings from Hostaway system

**Authentication Flow:**
1. Client credentials grant for Hostaway API access
2. Token-based authentication with Bearer token
3. Automatic token refresh handling

**Response Structure:**
```json
{
  "status": "success",
  "result": [
    {
      "id": "property_id",
      "name": "Property Name",
      "city": "City",
      "countryCode": "UK",
      "roomType": "entire_home",
      "personCapacity": 4,
      "bedroomsNumber": 2,
      "bathroomsNumber": 1,
      "price": 150
    }
  ]
}
```

**Error Handling:**
- 400: Missing API credentials
- 401: Authentication failure
- 500: Hostaway API errors

### Reviews API (`/api/reviews`)
**Endpoint:** `GET /api/reviews`
**Purpose:** Fetch and manage property reviews with visibility controls

**Query Parameters:**
- `includeHidden`: Boolean to show/hide hidden reviews
- Standard Hostaway pagination and filtering

**Data Processing Pipeline:**
1. Fetch reviews from Hostaway API
2. Retrieve visibility states from MongoDB
3. Normalize and merge data
4. Apply visibility filters
5. Return processed review data

**Fallback Strategy:**
- Mock data fallback when Hostaway API is unavailable
- Ensures application functionality during API outages

**Response Structure:**
```json
{
  "status": "success",
  "result": [
    {
      "id": "review_id",
      "property": "Property Name",
      "guest": "Guest Name",
      "rating": 5,
      "comment": "Review text",
      "is_hidden": false,
      "channel": "Airbnb"
    }
  ],
  "count": 25
}
```

### Google Reviews API (`/api/google-reviews`)
**Endpoint:** `GET /api/google-reviews`
**Purpose:** Integrate Google Places reviews for comprehensive feedback

**Features:**
- Google Places API integration
- Review aggregation from multiple sources
- Rating normalization across platforms

### Database Operations
**Review State Management:**
- CRUD operations for review visibility
- Indexed queries for performance
- Timestamp tracking for audit purposes

**Connection Management:**
- Singleton MongoDB connection pattern
- Automatic connection state checking
- Environment-based configuration

## Performance Optimizations

### Caching Strategy
- React Query provides intelligent caching
- 60-second stale time for listings
- Background refetching for fresh data

### Database Indexing
- Compound indexes on review ID and visibility
- Optimized queries for filtering operations
- Efficient lookup performance

### Component Optimization
- Memoized calculations for expensive operations
- Lazy loading of review sections
- Responsive design for mobile optimization

## Security Considerations

### API Key Management
- Environment variable configuration
- No hardcoded credentials
- Secure token handling

### Data Validation
- Input sanitization for user queries
- Type safety with TypeScript

