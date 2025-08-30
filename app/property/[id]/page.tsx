'use client';

import { useParams } from 'next/navigation';
import { useListing } from '@/lib/hooks/listings';
import ImageGallery from "@/components/ImageGallery";
import PropertyInfo from "@/components/PropertyInfo";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import BookingWidget from "@/components/BookingWidget";
import Footer from "@/components/Footer";
import PropertyHeader from "@/components/PropertyHeader";
import PoliciesSection from "@/components/PoliciesSection";
import Reviews from "@/components/Reviews";
import Header from '@/components/PageHeader';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const { data: listingData, isLoading, error } = useListing(propertyId);

  if (isLoading) {
    return (
      <div className="bg-foreground min-h-screen">
        <Header />
        <main className="mx-auto px-4 sm:px-6 lg:px-12 pt-[88px] mb-10">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-foreground min-h-screen">
        <Header />
        <main className="mx-auto px-4 sm:px-6 lg:px-12 pt-[88px] mb-10">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">Error: {error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!listingData?.result) {
    return (
      <div className="bg-foreground min-h-screen">
        <Header />
        <main className="mx-auto px-4 sm:px-6 lg:px-12 pt-[88px] mb-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800">Property not found</p>
          </div>
        </main>
      </div>
    );
  }

  const property = listingData.result;

  // Transform the API data to match the component expectations
  const transformedProperty = {
    ...property,
    // Extract image URLs from listingImages array
    images: property.listingImages?.map((img: any) => img.url) || [],
    // Extract amenities from listingAmenities array
    amenities: property.listingAmenities?.map((amenity: any) => amenity.amenityName) || [],
    // Transform location data
    location: {
      address: property.address || property.publicAddress,
      coordinates: {
        lat: property.lat,
        lng: property.lng
      }
    }
  };


  return (
    <div className="bg-foreground">
      <Header />
      <main className="mx-auto px-4 sm:px-6 lg:px-12 pt-[88px] mb-10">
        <div className="py-2 md:py-4"></div>
        <ImageGallery images={transformedProperty.images} />
        <PropertyHeader property={transformedProperty} />
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 mt-8">
          <div className="lg:col-span-2">
            <PropertyInfo property={transformedProperty} />
            <div className="py-8 border-t border-gray-200">
              <Amenities amenities={transformedProperty.amenities} />
            </div>
            
            {/* Reviews Section - Moved up for better prominence */}
            <div className="py-8 border-t border-gray-200">
              <Reviews 
                propertyId={property.id.toString()} 
                propertyName={property.name} 
                propertyAddress={property.address || property.publicAddress}
                latitude={property.lat}
                longitude={property.lng}
              />
            </div>
            
            <div className="py-8 border-t border-gray-200">
              <PoliciesSection />
            </div>
            <div className="py-8 border-t border-gray-200">
              <Location location={transformedProperty.location} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget property={transformedProperty} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}