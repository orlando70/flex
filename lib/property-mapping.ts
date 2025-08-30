import { PropertyPlaceMapping } from './google-places';

// In-memory storage for demo purposes
// In production, this would be stored in a database
const propertyMappings: Map<string, PropertyPlaceMapping> = new Map();

// Sample mappings for demo properties only (no real property mappings)
const sampleMappings: PropertyPlaceMapping[] = [
  {
    propertyId: 'demo-property-1',
    propertyName: 'Luxury Apartment in London',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    address: '123 Oxford Street, London, UK',
    lastUpdated: new Date(),
  },
  {
    propertyId: 'demo-property-2',
    propertyName: 'The Flex London',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    address: '456 Regent Street, London, UK',
    lastUpdated: new Date(),
  },
];

// Initialize with sample data
sampleMappings.forEach(mapping => {
  propertyMappings.set(mapping.propertyId, mapping);
});

export class PropertyMappingService {
  /**
   * Get Google Place ID for a property
   */
  static getPlaceId(propertyId: string): string | null {
    const mapping = propertyMappings.get(propertyId);
    return mapping?.googlePlaceId || null;
  }

  /**
   * Get Google Place ID for a property with automatic search fallback
   */
  static async getPlaceIdWithFallback(
    propertyId: string, 
    propertyName?: string, 
    address?: string,
    latitude?: number,
    longitude?: number
  ): Promise<string | null> {
    
    // First try to get from existing mappings
    const existingPlaceId = this.getPlaceId(propertyId);
    if (existingPlaceId) {
      return existingPlaceId;
    }

    // If we have coordinates, use them for more accurate search
    if (latitude && longitude && propertyName && address) {
      try {
        const mapping = await this.createMappingFromCoordinates(propertyId, propertyName, address, latitude, longitude);
        if (mapping?.googlePlaceId) {
          return mapping.googlePlaceId;
        } else {
          console.log('❌ No Google Place ID found via coordinates');
        }
      } catch (error) {
        console.warn('Failed to auto-search for Google Place ID using coordinates:', error);
      }
    }

    // Fallback to text-based search if coordinates failed or weren't provided
    if (propertyName && address) {
      try {
        const mapping = await this.createMappingFromSearch(propertyId, propertyName, address);
        if (mapping?.googlePlaceId) {
          return mapping.googlePlaceId;
        } else {
          console.log('❌ No Google Place ID found via text search');
        }
      } catch (error) {
        console.warn('Failed to auto-search for Google Place ID:', error);
        return null;
      }
    }

    return null;
  }

  /**
   * Get mapping by property ID
   */
  static getMapping(propertyId: string): PropertyPlaceMapping | null {
    return propertyMappings.get(propertyId) || null;
  }

  /**
   * Get mapping by property name
   */
  static getMappingByName(propertyName: string): PropertyPlaceMapping | null {
    for (const mapping of propertyMappings.values()) {
      if (mapping.propertyName === propertyName) {
        return mapping;
      }
    }
    return null;
  }

  /**
   * Add or update a property mapping
   */
  static setMapping(mapping: PropertyPlaceMapping): void {
    propertyMappings.set(mapping.propertyId, {
      ...mapping,
      lastUpdated: new Date(),
    });
  }

  /**
   * Remove a property mapping
   */
  static removeMapping(propertyId: string): boolean {
    return propertyMappings.delete(propertyId);
  }

  /**
   * Get all mappings
   */
  static getAllMappings(): PropertyPlaceMapping[] {
    return Array.from(propertyMappings.values());
  }

  /**
   * Search for a place using coordinates and create mapping
   */
  static async createMappingFromCoordinates(
    propertyId: string,
    propertyName: string,
    address: string,
    latitude: number,
    longitude: number
  ): Promise<PropertyPlaceMapping | null> {
    
    try {
      const response = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latitude, 
          longitude, 
          propertyName,
          address 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search for place using coordinates');
      }

      const data = await response.json();
      
      if (data.data.placeId) {
        const mapping: PropertyPlaceMapping = {
          propertyId,
          propertyName,
          googlePlaceId: data.data.placeId,
          address,
          lastUpdated: new Date(),
        };

        this.setMapping(mapping);
        return mapping;
      }

      return null;
    } catch (error) {
      console.error('Error creating mapping from coordinates:', error);
      return null;
    }
  }

  /**
   * Search for a place and create mapping
   */
  static async createMappingFromSearch(
    propertyId: string,
    propertyName: string,
    address: string,
    searchQuery?: string
  ): Promise<PropertyPlaceMapping | null> {
    try {
      // Use the search query or construct one from property name and address
      const query = searchQuery || `${propertyName}, ${address}`;
      
      const response = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to search for place');
      }

      const data = await response.json();
      
      if (data.data.placeId) {
        const mapping: PropertyPlaceMapping = {
          propertyId,
          propertyName,
          googlePlaceId: data.data.placeId,
          address,
          lastUpdated: new Date(),
        };

        this.setMapping(mapping);
        return mapping;
      }

      return null;
    } catch (error) {
      console.error('Error creating mapping from search:', error);
      return null;
    }
  }

  /**
   * Validate a Google Place ID
   */
  static async validatePlaceId(placeId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/google-reviews?placeId=${placeId}`);
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.status === 'success' && data.data.source === 'google';
    } catch (error) {
      console.error('Error validating place ID:', error);
      return false;
    }
  }

  /**
   * Get mapping statistics
   */
  static getStats(): {
    totalMappings: number;
    validMappings: number;
    lastUpdated: Date | null;
  } {
    const mappings = this.getAllMappings();
    const lastUpdated = mappings.length > 0 
      ? new Date(Math.max(...mappings.map(m => m.lastUpdated.getTime())))
      : null;

    return {
      totalMappings: mappings.length,
      validMappings: mappings.length, // In a real implementation, you'd validate these
      lastUpdated,
    };
  }
}

// Export utility functions
export const getPropertyPlaceId = PropertyMappingService.getPlaceId;
export const getPropertyMapping = PropertyMappingService.getMapping;
export const setPropertyMapping = PropertyMappingService.setMapping;
export const createPropertyMapping = PropertyMappingService.createMappingFromSearch;
