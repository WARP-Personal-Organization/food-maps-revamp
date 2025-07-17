"use client";

import React, { useMemo, useState } from "react";
import MapComponent from "../components/maps/MapComponent";
import FoodPrintSummaryPanel from "../components/panel/FoodPrintSummaryPanel.tsx";
import LocationDetailPanel from "@/components/panel/LocationDetailPanel";
import FilterPanel from "@/components/panel/FilterPanel";

// import { LocationData } from "@/data/LocationData";
import { FoodPrintData } from "@/data/FoodPrintData";
import { DishData } from "@/data/dish";
import { districts } from "@/data/DistrictCoordinatesData";

import { FoodPrint, Location } from "@/types/types";

/* ──────────────────────────────────────────────────────────────────────────── */

const MapPage = () => {
  const [loading, setLoading] = useState(true);

  /* ────────── map data ───────── */
  // const allLocations = useMemo(() => Object.values(LocationData).flat(), []);
  const foodprints = useMemo(
    () => Object.values(FoodPrintData).flat() as FoodPrint[],
    []
  );

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

  /* ======================================================================== */
  return (
    <div className="relative h-screen w-full">
      {/* ── Food-print panel (desktop left-side slide-in) ─────────────────── */}
      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={showFoodPrintPanel}
        onClose={() => {
          setShowFoodPrintPanel(false);
          setSelectedFoodPrint(null);
        }}
      />

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

      {/* ── Dish filter panel ─────────────────────────────────────────────── */}
      <FilterPanel
        dishData={DishData}
        initialSelectedDishes={selectedDishes}
        isVisible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onFilterApply={(filters) => {
          setSelectedDishes(filters);
          console.log("Applied Filters:", filters);
        }}
      />

      {/* quick button just to open the filter panel */}
      <button
        onClick={() => setShowFilterPanel(true)}
        className="absolute top-4 left-4 z-[45] bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl shadow"
      >
        Filter Dishes
      </button>

      {/* ── loading veil ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
          <p className="text-white text-lg animate-pulse">Loading map…</p>
        </div>
      )}

      {/* ── MAP ───────────────────────────────────────────────────────────── */}
      <MapComponent
        /* data */
        locations={[]}
        foodPrintMarkers={foodprints}
        districts={districts}
        mapBounds={mapBounds}
        mapImageUrl="/images/map/Map.webp"
        defaultZoom={0}
        useCustomMap
        isDesktop
        /* interactions */
        onFoodPrintClick={(fp) => {
          setSelectedFoodPrint(fp);
          setShowFoodPrintPanel(true);
        }}
        onLocationClick={(loc) => {
          setSelectedLocation(loc);
          setShowLocationPanel(true);
        }}
        /* misc */
        mapStyle="mapbox://styles/mapbox/light-v10"
        onMapLoaded={() => setLoading(false)}
      />
    </div>
  );
};

export default MapPage;
