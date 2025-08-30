# Google Maps Integration Setup

This project now includes Google Maps integration in the Location component. Follow these steps to set it up:

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (if you want to use Google Places features)
4. Go to Credentials → Create Credentials → API Key
5. Copy your API key

## 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Google Places API Key (if different from Maps API key)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

## 3. Restrict API Key (Recommended)

For security, restrict your API key:
1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers (web sites)"
4. Add your domain(s) (e.g., `localhost:3000/*` for development)
5. Under "API restrictions", select "Restrict key" and choose only the APIs you need

## 4. Features

The Google Maps integration includes:
- Interactive map with property location marker
- Custom marker design
- Info window with coordinates
- Map controls (zoom, street view, fullscreen)
- Responsive design
- Error handling and loading states
- Fallback to placeholder when coordinates are not available

## 5. Usage

The Location component automatically displays the map when coordinates are provided:

```tsx
<Location 
  location={{
    address: "123 Main St, City, Country",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }}
/>
```

## 6. Troubleshooting

- **Map not loading**: Check your API key and ensure the Maps JavaScript API is enabled
- **CORS errors**: Make sure your domain is added to the API key restrictions
- **Quota exceeded**: Check your Google Cloud billing and quotas

## 7. Cost Considerations

Google Maps API has usage-based pricing:
- Maps JavaScript API: $7 per 1,000 map loads
- Places API: $17 per 1,000 requests
- Consider setting up billing alerts in Google Cloud Console

## 8. Development vs Production

- **Development**: Use `localhost:3000/*` in API key restrictions
- **Production**: Add your production domain to API key restrictions
- **Testing**: Use the same API key for both environments during development
