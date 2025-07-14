'use client';
import React, { useMemo, useState } from 'react';
import { Location, FoodPrint, District } from '@/types/types';
import MapComponent from "../components/maps/MapComponent";
import { LocationData } from '@/data/LocationData';
import { districts } from '@/data/DistrictCoordinatesData';

const MapPage = () => {
  const [loading, setLoading] = useState(true);

  const allLocations = useMemo(() => Object.values(LocationData).flat(), []);
  const foodPrintMarkers = useMemo(() => [
    {
      name: 'Food Print A',
      x: 700,
      y: 300,
      iconUrl: "/images/pin-marker-icons/siopao.webp",
      location: '',
      description: '',
      extendedDescription: [],
      dishType: undefined,
      heroImage: '',
      mapLink: '',
    },
  ], []);

  const mapBounds: [[number, number], [number, number]] = [
    [0, 0],
    [1000, 1000],
  ];

  return (
    <div className="relative h-screen w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <p className="text-white text-lg animate-pulse">Loading map...</p>
        </div>
      )}
      <MapComponent
        locations={allLocations}
        foodPrintMarkers={foodPrintMarkers}
        districts={districts}
        mapBounds={mapBounds}
        defaultZoom={0}
        isDesktop={true}
        onLocationClick={(loc: any) => console.log('Clicked location', loc)}
        onFoodPrintClick={(fp: any) => console.log('Clicked food print', fp)}
        mapStyle="mapbox://styles/mapbox/light-v10"
        useCustomMap={true}
        mapImageUrl="/images/map/Map.webp"
        onMapLoaded={() => setLoading(false)} // ✅ Call this from inside MapComponent
      />
    </div>
  );
};

export default MapPage;
