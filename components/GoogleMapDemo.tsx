"use client";

import GoogleMap from './GoogleMap';

export default function GoogleMapDemo() {
  // Sample coordinates for London (Bromley area)
  const sampleCoordinates = {
    lat: 51.4102168,
    lng: 0.0238711
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Maps Integration Demo</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Map</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <GoogleMap 
              center={sampleCoordinates}
              zoom={15}
              className="w-full h-full"
              showMarker={true}
              markerTitle="Sample Property Location"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Map with Nearby Places</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <GoogleMap 
              center={sampleCoordinates}
              zoom={15}
              className="w-full h-full"
              showMarker={true}
              markerTitle="Sample Property Location"
              showNearbyPlaces={true}
              showDirections={true}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Map with Different Zoom Level</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <GoogleMap 
              center={sampleCoordinates}
              zoom={12}
              className="w-full h-full"
              showMarker={true}
              markerTitle="Sample Property Location"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Create a <code>.env.local</code> file in your project root</li>
          <li>Add your Google Maps API key: <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
          <li>Enable the Maps JavaScript API in Google Cloud Console</li>
          <li>Restrict the API key to your domain for security</li>
        </ol>
      </div>
    </div>
  );
}
