import Image from 'next/image';

interface LocationProps {
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export default function Location({ location }: LocationProps) {
  const address = location?.address || 'Address not available';
  const coordinates = location?.coordinates;
  
  return (
    <div>
      <h2 className="text-xl font-semibold">Location</h2>
      <p className="text-sm text-gray-600 mt-2">{address}</p>
      <div className="mt-4 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        {coordinates ? (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Map would be displayed here</p>
              <p className="text-sm text-gray-500">
                Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        ) : (
          <Image src='/placeholder.svg' alt='Map' width='800' height='400' className="w-full h-full object-cover rounded-lg"/>
        )}
      </div>
      <button className="text-sm font-medium underline mt-2">Show more information about this area</button>
    </div>
  );
}