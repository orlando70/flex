# Google Reviews Integration - Implementation Guide

## Overview

This document provides a complete guide to the Google Reviews integration implemented for The Flex property management platform. The integration allows displaying Google Reviews alongside existing Hostaway reviews, providing a comprehensive review experience for users.

## 🚀 Features Implemented

### ✅ Core Features
- **Google Places API Integration**: Real-time fetching of Google reviews
- **Mock Data Fallback**: Graceful fallback when API is not configured
- **Combined Reviews Display**: Unified interface showing both Hostaway and Google reviews
- **Tabbed Interface**: Easy switching between review sources
- **Property Mapping System**: Link Flex properties to Google Place IDs
- **Admin Interface**: Manage property mappings through web interface
- **Responsive Design**: Works on all device sizes
- **Loading States**: Proper loading indicators and error handling

### 🎨 UI Components
- **EnhancedReviews**: Main component combining both review sources
- **GoogleReviews**: Dedicated Google reviews display component
- **Property Mapping Admin**: Management interface for mappings
- **Demo Page**: Showcase of all integration features

## 📁 File Structure

```
├── lib/
│   ├── google-places.ts              # Google Places API service
│   ├── property-mapping.ts           # Property mapping utilities
│   └── hooks/
│       └── google-reviews/
│           └── index.ts              # React hooks for Google reviews
├── app/
│   ├── api/
│   │   └── google-reviews/
│   │       └── route.ts              # API endpoints for Google reviews
│   ├── admin/
│   │   └── property-mappings/
│   │       └── page.tsx              # Admin interface
│   └── google-reviews-demo/
│       └── page.tsx                  # Demo page
├── components/
│   ├── EnhancedReviews.tsx           # Combined reviews component
│   ├── GoogleReviews.tsx             # Google reviews component
│   └── Reviews.tsx                   # Updated main reviews component
└── GOOGLE_REVIEWS_INTEGRATION.md     # Integration documentation
```

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install @googlemaps/js-api-loader axios
```

### 2. Environment Configuration

Add the following to your `.env.local` file:

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### 3. Google Cloud Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Places API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"

3. **Generate API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key

4. **Set Up Billing** (Required)
   - Enable billing for your Google Cloud project
   - Google Places API requires billing to be enabled

5. **Restrict API Key** (Recommended)
   - Click on your API key
   - Set application restrictions (HTTP referrers, IP addresses)
   - Limit to Places API only

## 🎯 Usage

### Basic Implementation

The integration is automatically available through the existing `Reviews` component:

```tsx
import Reviews from '../components/Reviews';

// In your component
<Reviews 
  propertyId="your-property-id"
  propertyName="Your Property Name"
/>
```

### Advanced Usage

For more control, use the `EnhancedReviews` component directly:

```tsx
import EnhancedReviews from '../components/EnhancedReviews';

<EnhancedReviews
  propertyId="your-property-id"
  propertyName="Your Property Name"
  googlePlaceId="ChIJN1t_tDeuEmsRUsoyG83frY4" // Optional
/>
```

### Google Reviews Only

To display only Google reviews:

```tsx
import GoogleReviews from '../components/GoogleReviews';

<GoogleReviews
  placeId="ChIJN1t_tDeuEmsRUsoyG83frY4"
  propertyName="Your Property Name"
/>
```

## 🔧 Property Mapping

### Automatic Mapping

The system automatically looks up Google Place IDs for properties using the mapping system:

```typescript
import { getPropertyPlaceId } from '../lib/property-mapping';

const placeId = getPropertyPlaceId('your-property-id');
```

### Manual Mapping

Add property mappings through the admin interface:

1. Navigate to `/admin/property-mappings`
2. Fill in property details
3. Use the search function to find Google Place IDs
4. Save the mapping

### Programmatic Mapping

```typescript
import { PropertyMappingService } from '../lib/property-mapping';

// Add a mapping
PropertyMappingService.setMapping({
  propertyId: 'property-123',
  propertyName: 'Luxury Apartment',
  googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  address: '123 Main St, London, UK',
  lastUpdated: new Date(),
});

// Search and create mapping
const mapping = await PropertyMappingService.createMappingFromSearch(
  'property-123',
  'Luxury Apartment',
  '123 Main St, London, UK',
  'Luxury Apartment London'
);
```

## 🎨 Customization

### Styling

All components use Tailwind CSS classes and can be customized:

```tsx
// Custom styling for Google reviews
<GoogleReviews
  placeId="ChIJN1t_tDeuEmsRUsoyG83frY4"
  className="custom-google-reviews"
/>
```

### Mock Data

Customize mock data in `lib/google-places.ts`:

```typescript
export const mockGoogleReviews: GoogleReview[] = [
  {
    author_name: 'Your Custom Name',
    rating: 5,
    relative_time_description: '1 month ago',
    text: 'Your custom review text',
    time: Date.now() - 30 * 24 * 60 * 60 * 1000,
    language: 'en',
    profile_photo_url: 'https://your-image-url.com/photo.jpg',
  },
  // Add more mock reviews...
];
```

## 🔍 API Endpoints

### GET /api/google-reviews

Fetch Google reviews for a property:

```typescript
// With place ID
const response = await fetch('/api/google-reviews?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4');

// With property ID (falls back to mock data)
const response = await fetch('/api/google-reviews?propertyId=your-property-id');
```

### POST /api/google-reviews

Search for a place and get its Place ID:

```typescript
const response = await fetch('/api/google-reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: 'The Flex London',
    location: { lat: 51.5074, lng: -0.1278 } // Optional
  }),
});
```

## 📊 Monitoring & Analytics

### Rate Limiting

The integration includes built-in rate limiting:
- Free tier: 1,000 requests/day
- Paid tier: $17 per 1,000 requests
- QPS limit: 10 requests/second

### Error Handling

The system gracefully handles:
- API key not configured
- Network errors
- Invalid place IDs
- Rate limit exceeded
- API quota exceeded

### Logging

Monitor API usage through console logs:
- API key configuration status
- Request/response logging
- Error details

## 🧪 Testing

### Demo Page

Visit `/google-reviews-demo` to see all features in action:
- Combined reviews display
- Google reviews only
- Mock data fallback
- Error handling

### Test Scenarios

1. **With API Key**: Configure real Google Places API key
2. **Without API Key**: System falls back to mock data
3. **Invalid Place ID**: Error handling and fallback
4. **Network Issues**: Graceful error display

## 🔒 Security Considerations

### API Key Security

- Never expose API keys in client-side code
- Use environment variables
- Restrict API key usage
- Monitor API usage

### Rate Limiting

- Implement client-side rate limiting
- Cache responses appropriately
- Monitor usage patterns

## 📈 Performance Optimization

### Caching Strategy

- Reviews cached for 5 minutes (stale time)
- Garbage collection after 10 minutes
- Automatic revalidation

### Loading States

- Skeleton loading for better UX
- Progressive loading of review data
- Error boundaries for graceful failures

## 🚀 Deployment

### Environment Variables

Ensure these are set in production:

```env
GOOGLE_PLACES_API_KEY=your_production_api_key
```

### Build Process

The integration is included in the standard build process:

```bash
npm run build
npm start
```

## 🔄 Future Enhancements

### Planned Features

1. **Review Analytics**: Enhanced insights and metrics
2. **Review Monitoring**: Automated alerts for new reviews
3. **Multi-Source Aggregation**: Support for additional review platforms
4. **Automated Place Discovery**: Geocoding-based mapping
5. **Review Response System**: Ability to respond to reviews

### API Improvements

1. **Batch Processing**: Handle multiple properties efficiently
2. **Webhook Support**: Real-time review updates
3. **Advanced Filtering**: Filter reviews by rating, date, language
4. **Review Sentiment Analysis**: AI-powered review insights

## 🆘 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify API key is correct
   - Check billing is enabled
   - Ensure Places API is enabled
   - Verify API key restrictions

2. **No Reviews Displaying**
   - Check property mapping exists
   - Verify place ID is valid
   - Check network connectivity
   - Review console for errors

3. **Rate Limit Exceeded**
   - Monitor API usage
   - Implement caching
   - Consider upgrading to paid tier

### Debug Mode

Enable debug logging by setting:

```typescript
// In lib/google-places.ts
const DEBUG = true;
```

## 📞 Support

For issues or questions:

1. Check the demo page: `/google-reviews-demo`
2. Review console logs for errors
3. Verify API key configuration
4. Test with mock data first

## 📄 License

This integration is part of The Flex platform and follows the same licensing terms.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
