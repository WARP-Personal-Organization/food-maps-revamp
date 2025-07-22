"use client";

import React, { useMemo, useState } from "react";
import MapComponent from "../components/maps/MapComponent";
import FoodPrintSummaryPanel from "../components/panel/FoodPrintSummaryPanel.tsx";
import LocationDetailPanel from "@/components/panel/LocationDetailPanel";
import FilterPanel from "@/components/panel/FilterPanel";
import ExplorePanel from "@/components/panel/ExplorePanel";
// import { LocationData } from "@/data/LocationData";
import { FoodPrintData } from "@/data/FoodPrintData";
import { DishData } from "@/data/dish";
import { districts } from "@/data/DistrictCoordinatesData";
import MenuPanel from "@/components/panel/MenuPanel";
import { FoodPrint, Location } from "@/types/types";
import MenuButton from "@/components/buttons/MenuButton";
import FilterButton from "@/components/buttons/filterbutton";
import AboutPanel from "@/components/panel/AboutPanel";

// import { LocationData } from '@/data/LocationData';

const MapPage = () => {
  const [loading, setLoading] = useState(true);
  const [showExplorePanel, setShowExplorePanel] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  // const foodprints = useMemo(() => Object.values(FoodPrintData).flat() as FoodPrint[], []);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [showFoodPrintPanel, setShowFoodPrintPanel] = useState(false);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const mapBounds: [[number, number], [number, number]] = [
    [0, 0],
    [1000, 1000],
  ];

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
      <AboutPanel
        isVisible={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
      />
      <MenuButton onClick={() => setIsMenuVisible(true)} />
      <LocationDetailPanel
        location={selectedLocation}
        isVisible={showLocationPanel}
        onClose={() => {
          setShowLocationPanel(false);
          setSelectedLocation(null);
        }}
        onViewDetails={() => {
          console.log("TODO: navigate to full location page");
        }}
      />

      <FilterPanel
        dishData={DishData}
        initialSelectedDishes={selectedDishes}
        isVisible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onFilterApply={(filters) => {
          setSelectedDishes(filters);
          setShowExplorePanel(true);
          console.log("Applied Filters:", filters);
        }}
      />

      <FilterButton onClick={() => setShowFilterPanel(true)} />
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
          <p className="text-white text-lg animate-pulse">Loading map…</p>
        </div>
      )}
      <ExplorePanel
        activeFilters={selectedDishes}
        isVisible={showExplorePanel}
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
          console.log("Home clicked");
          setIsMenuVisible(false);
        }}
        onOpenAbout={() => {
          setIsAboutVisible(true);
          setIsMenuVisible(false);
        }}
      />
      <AboutPanel
        isVisible={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
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
          setSelectedFoodPrint(fp);
          setShowFoodPrintPanel(true);
        }}
        onLocationClick={(loc) => {
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
