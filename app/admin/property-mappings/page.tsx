'use client';

import { useState, useEffect } from 'react';
import { PropertyMappingService } from '../../../lib/property-mapping';
import { PropertyPlaceMapping } from '../../../lib/google-places';

export default function PropertyMappingsAdmin() {
  const [mappings, setMappings] = useState<PropertyPlaceMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMapping, setNewMapping] = useState({
    propertyId: '',
    propertyName: '',
    address: '',
    googlePlaceId: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadMappings();
  }, []);

  const loadMappings = () => {
    const allMappings = PropertyMappingService.getAllMappings();
    setMappings(allMappings);
    setLoading(false);
  };

  const handleAddMapping = () => {
    if (!newMapping.propertyId || !newMapping.propertyName) {
      alert('Property ID and Property Name are required');
      return;
    }

    const mapping: PropertyPlaceMapping = {
      propertyId: newMapping.propertyId,
      propertyName: newMapping.propertyName,
      googlePlaceId: newMapping.googlePlaceId,
      address: newMapping.address,
      lastUpdated: new Date(),
    };

    PropertyMappingService.setMapping(mapping);
    setMappings(PropertyMappingService.getAllMappings());
    
    // Reset form
    setNewMapping({
      propertyId: '',
      propertyName: '',
      address: '',
      googlePlaceId: '',
    });
  };

  const handleRemoveMapping = (propertyId: string) => {
    if (confirm('Are you sure you want to remove this mapping?')) {
      PropertyMappingService.removeMapping(propertyId);
      setMappings(PropertyMappingService.getAllMappings());
    }
  };

  const handleSearchPlace = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to search for place');
      }

      const data = await response.json();
      
      if (data.data.placeId) {
        setNewMapping(prev => ({
          ...prev,
          googlePlaceId: data.data.placeId,
        }));
        alert(`Found place ID: ${data.data.placeId}`);
      } else {
        alert('No place found for this query');
      }
    } catch (error) {
      console.error('Error searching for place:', error);
      alert('Error searching for place. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const stats = PropertyMappingService.getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Property Mappings Management
          </h1>
          <p className="text-gray-600">
            Manage the mapping between Flex properties and Google Place IDs for reviews integration.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Mappings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalMappings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Valid Mappings</h3>
            <p className="text-3xl font-bold text-green-600">{stats.validMappings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">
              {stats.lastUpdated ? stats.lastUpdated.toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Add New Mapping */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Mapping</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property ID *
              </label>
              <input
                type="text"
                value={newMapping.propertyId}
                onChange={(e) => setNewMapping(prev => ({ ...prev, propertyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., property-123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name *
              </label>
              <input
                type="text"
                value={newMapping.propertyName}
                onChange={(e) => setNewMapping(prev => ({ ...prev, propertyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Luxury Apartment in London"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={newMapping.address}
                onChange={(e) => setNewMapping(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 123 Oxford Street, London, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Place ID
              </label>
              <input
                type="text"
                value={newMapping.googlePlaceId}
                onChange={(e) => setNewMapping(prev => ({ ...prev, googlePlaceId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ChIJN1t_tDeuEmsRUsoyG83frY4"
              />
            </div>
          </div>

          {/* Place Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search for Place ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for a place (e.g., 'The Flex London')"
              />
              <button
                onClick={handleSearchPlace}
                disabled={searching}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <button
            onClick={handleAddMapping}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Mapping
          </button>
        </div>

        {/* Existing Mappings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Mappings</h2>
          
          {mappings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No mappings found. Add your first mapping above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Google Place ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mappings.map((mapping) => (
                    <tr key={mapping.propertyId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mapping.propertyId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mapping.propertyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapping.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {mapping.googlePlaceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapping.lastUpdated.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveMapping(mapping.propertyId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
