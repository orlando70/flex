import { Users, Bed, Bath, Home } from 'lucide-react';

interface PropertyHeaderProps {
  property?: any;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  if (!property) {
    return (
      <div className="w-full px-6 py-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Studio cosy proche des Buttes-Chaumont</h1>
        
        {/* Property stats */}
        <div className="flex items-start space-x-12 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users size={20} className="text-gray-600 mt-1" />
            <div className='flex flex-col items-center'>
              <div className="text-base font-medium text-gray-900">2</div>
              <div className="text-sm text-gray-600">guests</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bed size={20} className="text-gray-600 mt-1" />
            <div className='flex flex-col items-center'>
              <div className="text-base font-medium text-gray-900">0</div>
              <div className="text-sm text-gray-600">bedrooms</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bath size={20} className="text-gray-600 mt-1" />
            <div>
              <div className='flex flex-col items-center'>
                <div className="text-base font-medium text-gray-900">1</div>
                <div className="text-sm text-gray-600">bathrooms</div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Home size={20} className="text-gray-600 mt-1" />
            <div className='flex flex-col items-center'>
              <div className="text-base font-medium text-gray-900">1</div>
              <div className="text-sm text-gray-600">beds</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">{property.name}</h1>
      
      {/* Property stats */}
      <div className="flex items-start space-x-12 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Users size={20} className="text-gray-600 mt-1" />
          <div className='flex flex-col items-center'>
            <div className="text-base font-medium text-gray-900">{property.personCapacity}</div>
            <div className="text-sm text-gray-600">guests</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Bed size={20} className="text-gray-600 mt-1" />
          <div className='flex flex-col items-center'>
            <div className="text-base font-medium text-gray-900">{property.bedroomsNumber}</div>
            <div className="text-sm text-gray-600">bedrooms</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Bath size={20} className="text-gray-600 mt-1" />
          <div>
            <div className='flex flex-col items-center'>
              <div className="text-base font-medium text-gray-900">{property.bathroomsNumber}</div>
              <div className="text-sm text-gray-600">bathrooms</div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Home size={20} className="text-gray-600 mt-1" />
          <div className='flex flex-col items-center'>
            <div className="text-base font-medium text-gray-900">{property.bedroomsNumber}</div>
            <div className="text-sm text-gray-600">beds</div>
          </div>
        </div>
      </div>
    </div>
  );
}