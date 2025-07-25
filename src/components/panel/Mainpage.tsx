'use client';

import React, { useMemo, useState } from 'react';
import MapComponent from '@/components/maps/MapComponent';
import FoodPrintSummaryPanel from '@/components/panel/FoodPrintSummaryPanel.tsx';
import LocationSummaryPanel from '@/components/panel/LocationDetailPanel';
import FilterPanel from '@/components/panel/FilterPanel';
import ExplorePanel from '@/components/panel/ExplorePanel';
import { FoodPrintData } from '@/data/FoodPrintData';
import { DishData } from '@/data/dish';
import { districts } from '@/data/DistrictCoordinatesData';
import MenuPanel from '@/components/panel/MenuPanel';
import { FoodPrint, Location } from '@/types/types';
import MenuButton from '@/components/buttons/MenuButton';
import FilterButton from '@/components/buttons/filterbutton';
import AboutPanel from '@/components/panel/AboutPanel';
import HomePanel from './HomePanel';
import HomeButton from '../buttons/HomeButton';

const MapPage = () => {
  const [loading, setLoading] = useState(true);
  const [showExplorePanel, setShowExplorePanel] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('Siopao'); // Default fallback

  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [showHomePanel, setShowHomePanel] = useState(false);

  const [showFoodPrintPanel, setShowFoodPrintPanel] = useState(false);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const mapBounds: [[number, number], [number, number]] = [
    [0, 0],
    [1000, 1000],
  ];

  const closeAllPanels = () => {
    setShowFoodPrintPanel(false);
    setShowLocationPanel(false);
    setShowExplorePanel(false);
    setShowFilterPanel(false);
    setIsMenuVisible(false);
    setIsAboutVisible(false);
    setShowHomePanel(false);
  };
  const handleFilterFromHome = (filters: string[]) => {
    setSelectedDishes(filters);
    setShowHomePanel(false);
    if (!isMobile) setShowExplorePanel(true);
  };
  const filteredLocations =
    selectedDishes.length === 0
      ? []
      : selectedDishes.flatMap((dishName) => {
          const dish = DishData.find((d) => d.name === dishName);
          return dish?.locations || [];
        });

  const filteredFoodPrints: FoodPrint[] = useMemo(() => {
    const allFoodPrints = Object.values(FoodPrintData).flat() as FoodPrint[];

    if (selectedDishes.length === 0) return allFoodPrints;

    return allFoodPrints.filter((fp) => selectedDishes.includes(fp.dishType));
  }, [selectedDishes]);

  return (
    <div className="relative h-screen w-full">
      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={showFoodPrintPanel}
        onClose={() => {
          setShowFoodPrintPanel(false);
          setSelectedFoodPrint(null);
        }}
      />
      <AboutPanel isVisible={isAboutVisible} onClose={() => setIsAboutVisible(false)} />
      <MenuButton
        onClick={() => {
          closeAllPanels();
          setIsMenuVisible(true);
        }}
      />
      <LocationSummaryPanel
        location={selectedLocation}
        locationKey={selectedLocationKey}
        isVisible={showLocationPanel}
        onClose={() => {
          setShowLocationPanel(false);
          setSelectedLocation(null);
        }}
        onViewDetails={() => {
          console.log('TODO: navigate to full location page');
        }}
      />
      <FilterPanel
        dishData={DishData}
        initialSelectedDishes={selectedDishes}
        isVisible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onFilterApply={(filters) => {
          closeAllPanels();
          setSelectedDishes(filters);
          if (!isMobile) {
            setShowExplorePanel(true);
          }
          console.log('Applied Filters:', filters);
        }}
      />

      <div className="fixed top-6 left-4 z-30 flex flex-col gap-4">
        {isMobile && (
          <HomeButton
            onClick={() => {
              setShowHomePanel(true);
            }}
          />
        )}
        <FilterButton
          onClick={() => {
            closeAllPanels();
            setShowFilterPanel(true);
          }}
        />
      </div>

      <HomePanel
        dishes={DishData}
        isVisible={showHomePanel}
        openMenu={() => {
          closeAllPanels();
        }}
        onClose={() => setShowHomePanel(false)}
        onFilterApply={handleFilterFromHome}
      />

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
          <p className="text-white text-lg animate-pulse">Loading map…</p>
        </div>
      )}

      <ExplorePanel
        activeFilters={selectedDishes}
        isVisible={!isMobile && showExplorePanel}
        onClose={() => setShowExplorePanel(false)}
        onFilterChange={(filters) => {
          setSelectedDishes(filters);
          if (filters.length === 0) {
            setShowExplorePanel(false);
          }
        }}
      />

      <MenuPanel
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onOpenHome={() => {
          closeAllPanels();
          console.log('Home clicked');
        }}
        onOpenAbout={() => {
          closeAllPanels();
          setIsAboutVisible(true);
        }}
      />

      <MapComponent
        locations={filteredLocations}
        foodPrintMarkers={filteredFoodPrints}
        districts={districts}
        mapBounds={mapBounds}
        mapImageUrl="/images/map/Map.webp"
        defaultZoom={0}
        useCustomMap
        isDesktop
        onFoodPrintClick={(fp) => {
          closeAllPanels();
          setSelectedFoodPrint(fp);
          setShowFoodPrintPanel(true);
        }}
        onLocationClick={(loc) => {
          closeAllPanels();
          setSelectedLocation(loc);
          setShowLocationPanel(true);
        }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onMapLoaded={() => setLoading(false)}
      />
    </div>
  );
};

export default MapPage;
