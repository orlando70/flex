# One-pager: Reviews Dashboard for Flex Living

## 1. TL;DR
A comprehensive reviews management dashboard for Flex Living property managers to monitor guest feedback across all booking channels, identify performance trends, and curate reviews for public display. This tool transforms scattered review data into actionable insights while enabling managers to showcase the best guest experiences on property pages.

## 2. Goals
### Business Goals
* Improve property performance through data-driven insights from guest feedback
* Increase booking conversion rates by displaying curated positive reviews on property pages
* Reduce response time to guest issues by surfacing recurring problems early
* Standardize review management across Flex Living's property portfolio

### User Goals
* Quickly assess property performance at a glance with visual dashboards
* Filter and analyze reviews by rating, category, channel, and time period
* Identify trends and recurring issues to proactively address property concerns
* Easily select high-quality reviews for public display to attract future guests

### Non-Goals
* Building a guest review submission system (reviews come from existing channels)
* Automated response generation to guest reviews
* Integration with property management systems beyond reviews data
* Multi-language review translation or sentiment analysis

## 3. User stories
**Primary Persona: Property Manager**
* As a property manager, I need to see all reviews for my properties in one place so I can track overall performance without switching between multiple platforms
* As a property manager, I want to identify properties with declining ratings so I can intervene before it impacts bookings
* As a property manager, I need to spot recurring maintenance issues across reviews so I can prioritize repairs and improvements
* As a property manager, I want to showcase positive guest experiences on property pages to increase booking confidence

**Secondary Persona: Regional Manager**
* As a regional manager, I need to compare property performance across my portfolio to identify best practices and underperformers
* As a regional manager, I want to track review trends over time to measure the impact of operational changes

## 4. Functional requirements
### Core Features (P0)
* **Hostaway API Integration**: Fetch, parse, and normalize review data from Hostaway with proper error handling
* **Property Performance Dashboard**: Visual overview showing average ratings, review count, and trends per property
* **Review Filtering & Sorting**: Filter by rating (1-5 stars), category (cleanliness, communication, etc.), channel, and date range
* **Review Curation Interface**: Select/approve reviews for public display with bulk actions and preview functionality

### Enhanced Features (P1)
* **Trend Analysis**: Identify rating changes over time with visual charts and alerts for significant drops
* **Issue Detection**: Surface frequently mentioned problems across reviews using keyword analysis
* **Public Review Display**: Responsive review section on property pages showing only manager-approved reviews
* **Export Functionality**: Download filtered review data as CSV for further analysis

### Future Considerations (P2)
* **Google Reviews Integration**: Explore Google Places API integration for additional review sources
* **Review Response Management**: Interface for managers to respond to reviews directly
* **Automated Alerts**: Email notifications for new negative reviews or significant rating changes

## 5. User experience
### Primary User Journey
* Manager logs into dashboard and sees property portfolio overview with key metrics
* Selects specific property to drill down into detailed review analysis
* Filters reviews by recent negative feedback to identify urgent issues
* Reviews trend charts to understand performance trajectory
* Selects high-quality reviews for public display on property pages
* Exports data to share insights with maintenance or operations teams

### Edge Cases & UI Notes
* **No Reviews Available**: Display empty state with helpful messaging about review collection timeline
* **API Failures**: Graceful error handling with retry mechanisms and user notifications
* **Large Datasets**: Implement pagination and virtualization for properties with hundreds of reviews
* **Mobile Experience**: Responsive design ensuring dashboard usability on tablets for on-site managers
* **Loading States**: Progressive loading with skeleton screens for better perceived performance

## 6. Narrative
Sarah, a Flex Living property manager, starts her Monday morning by opening the Reviews Dashboard. The homepage immediately shows her that Shoreditch Heights has dropped to 4.2 stars from 4.5 last month—a red flag that needs attention.

She clicks into the property detail view and filters for recent 1-2 star reviews. The pattern becomes clear: three guests in two weeks mentioned slow WiFi and noisy air conditioning. Sarah makes a note to schedule maintenance for both issues before they impact more bookings.

Next, she switches to her high-performing property in Camden. With a steady 4.8-star average and glowing feedback about the "amazing rooftop terrace" and "spotless modern kitchen," Sarah selects five recent reviews to feature on the property page. The preview shows exactly how guests will see them, maintaining Flex Living's clean aesthetic.

Before her coffee gets cold, Sarah has identified an urgent maintenance issue, updated public reviews to drive more bookings, and exported a trend report for her weekly team meeting. What used to take hours across multiple platforms now takes minutes in one unified dashboard.

## 7. Success metrics
* **Operational Efficiency**: 75% reduction in time spent collecting review data from multiple sources
* **Issue Response Time**: Average time to identify recurring problems decreased from 2 weeks to 2 days
* **Booking Conversion**: 15% increase in booking conversion on properties with curated reviews displayed
* **Review Coverage**: 80% of properties have current reviews displayed on public pages within 30 days
* **User Adoption**: 90% of property managers actively use the dashboard weekly within 60 days of launch

## 8. Milestones & sequencing
### Phase 1: Foundation (Weeks 1-3)
* Hostaway API integration with mock data
* Basic dashboard UI with property list and review display
* Core filtering functionality (rating, date, category)
* API route implementation and testing

### Phase 2: Management Features (Weeks 4-5)
* Review curation interface with approval workflows
* Public review display on property pages
* Trend visualization and basic analytics
* Export functionality for data analysis

### Phase 3: Enhancement (Weeks 6-7)
* Google Reviews API exploration and documentation
* Advanced filtering and search capabilities
* Performance optimizations and mobile responsiveness
* User testing and feedback incorporation

### Phase 4: Polish & Launch (Week 8)
* Final UI refinements and accessibility improvements
* Documentation and training materials
* Deployment and monitoring setup
* Post-launch support and iteration planning 








Implementation Plan
1. Data Fetching & Integration
Use the uselistings hook to fetch all property listings, matching the structure in listings-data.json.
For reviews, use the API endpoint, but if it returns an empty array, fallback to the mock data in mock-data.json.
For single property details, use the listing ID from the listings data and fetch via the single listing API.
2. Dashboard UI
Build a modern, user-friendly dashboard interface strictly following the design inspiration (colors, spacing, fonts, card styles).
Main dashboard view:
Display a grid or table of properties, each showing key performance metrics (e.g., bookings, revenue, ratings, review count).
Each property card/row is clickable for detailed analytics.
3. Filtering & Sorting
Add filter controls above the property/review list:
Rating: Filter by average review rating or by specific category ratings (cleanliness, communication, etc.).
Category: Filter by review categories.
Channel: Filter by booking channel (Airbnb, Booking.com, etc.).
Time: Filter by date range.
Add sorting options for rating, date, and other metrics.
Implement filtering and sorting logic client-side after fetching all data.
4. Trends & Recurring Issues
Aggregate review data by property, category, and time period (e.g., monthly averages).
Visualize trends using charts (line, bar, or area) for ratings and review counts over time.
Highlight recurring issues (e.g., consistently low scores, repeated negative comments) using color or icons.
Add a summary section listing top recurring issues or trends.
5. Review Selection for Public Website
Use MongoDB with Mongoose ODM to persist review visibility and admin acceptance.
Define a Mongoose schema for reviews, including:
All review fields from mock data
is_hidden (boolean) to indicate if a review is accepted for public display
Admins can toggle is_hidden in the dashboard.
On the property page, only display reviews where is_hidden is true.
6. Backend API
Create backend API endpoints to:
Fetch reviews (with is_hidden status)
Update review acceptance status (is_hidden)
Ensure endpoints are secure and only accessible to authorized admins.
7. Frontend Integration
Update dashboard UI to allow admins to accept/reject reviews for public display.
Sync review acceptance status with MongoDB via backend API.
Ensure real-time UI updates when review status changes.
8. Property Page
On the property details page, display only reviews accepted by admins (is_hidden: true).
9. General
Ensure all UI components strictly follow the design system.
Handle edge cases (e.g., missing data, API errors).
Document all code and logic for maintainability.