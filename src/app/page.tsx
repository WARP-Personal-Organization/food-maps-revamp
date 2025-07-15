'use client';
import React, { useMemo, useState } from 'react';

import MapComponent from '../components/maps/MapComponent';
import { LocationData } from '@/data/LocationData';
import { FoodPrintData } from '@/data/FoodPrintData';
import { districts } from '@/data/DistrictCoordinatesData';
import { FoodPrint } from '@/types/types';
import FoodPrintSummaryPanel from '@/components/panel/FoodPrintSummaryPanel.tsx';

const MapPage = () => {
  const [loading, setLoading] = useState(true);

  // You still compute allLocations in case you want to use them later
  const allLocations = useMemo(() => Object.values(LocationData).flat(), []);
  const foodprint = useMemo(() => Object.values(FoodPrintData).flat() as FoodPrint[], []);
  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const mapBounds: [[number, number], [number, number]] = [
    [0, 0],
    [1000, 1000],
  ];

  return (
    <div className="relative h-screen w-full">
      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={isPanelVisible}
        onClose={() => {
          setIsPanelVisible(false);
          setSelectedFoodPrint(null);
        }}
      />
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <p className="text-white text-lg animate-pulse">Loading map...</p>
        </div>
      )}
      <MapComponent
        locations={[]}
        foodPrintMarkers={foodprint}
        districts={districts}
        mapBounds={mapBounds}
        defaultZoom={0}
        isDesktop={true}
        onLocationClick={(loc) => console.log('Clicked location', loc)}
        onFoodPrintClick={(fp) => {
          console.log('Clicked food print', fp);
          setSelectedFoodPrint(fp);
          setIsPanelVisible(true);
        }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        useCustomMap={true}
        mapImageUrl="/images/map/Map.webp"
        onMapLoaded={() => setLoading(false)}
      />
    </div>
  );
};

export default MapPage;
