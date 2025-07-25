'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../../styles/map.css';
import { applySelectedStyle, applyDimmedStyle, applyDefaultStyle } from '@/data/markerStyles';
import { FoodPrint, Location, District } from '@/types/types';

interface MapComponentProps {
  locations: Location[];
  foodPrintMarkers?: FoodPrint[];
  districts?: District[];
  mapImageUrl?: string;
  mapBounds: [[number, number], [number, number]];
  defaultZoom?: number;
  onLocationClick?: (location: Location) => void;
  onFoodPrintClick?: (foodPrint: FoodPrint) => void;
  mapboxToken?: string;
  mapStyle?: string;
  useCustomMap?: boolean;
  isDesktop?: boolean;
  onMapLoaded?: () => void;
}

const xyToLngLat = (
  x: number,
  y: number,
  mapBounds: [[number, number], [number, number]]
): [number, number] => {
  const minX = mapBounds[0][1];
  const maxX = mapBounds[1][1];
  const minY = mapBounds[0][0];
  const maxY = mapBounds[1][0];

  const normalizedX = (x - minX) / (maxX - minX);
  const normalizedY = (y - minY) / (maxY - minY);

  const lng = -40 + normalizedX * 80;
  const lat = -40 + normalizedY * 80;

  return [lng, lat];
};

const MapComponent: React.FC<MapComponentProps> = ({
  onMapLoaded,
  locations = [],
  foodPrintMarkers = [],
  districts = [],
  mapImageUrl = '/images/map/FoodPrints-Map.webp',
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ],
  defaultZoom = 12,
  onLocationClick,
  onFoodPrintClick,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    '',
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  useCustomMap = true,
  isDesktop = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const selectedMarkerIdRef = useRef<string | null>(null);
  // Store dynamic dependencies in refs to avoid re-renders

  const customMapSourceId = useMemo(() => 'custom-map-layer', []);

  const hasFitBoundsRef = useRef(false);
  // Setup token on client
  useEffect(() => {
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    }
  }, [mapboxToken]);

  const isValidCoord = (point: { x: number; y: number }) =>
    typeof point.x === 'number' &&
    typeof point.y === 'number' &&
    !isNaN(point.x) &&
    !isNaN(point.y);

  const fallbackImage = (type: 'location' | 'foodprint') =>
    type === 'foodprint' ? '/siopao-foodprint-marker.webp' : '/siopao-1.webp';

  const createMarkerElement = (
    id: string,
    name: string,
    iconUrl: string,
    type: 'location' | 'foodprint'
  ): HTMLDivElement => {
    console.log('Marker clicked');
    const el = document.createElement('div');
    el.className = `custom-marker ${type}-marker`;
    el.setAttribute('data-marker-id', id);
    el.style.cursor = 'pointer';
    el.tabIndex = -1; // prevent focus if not needed

    const iconWrapper = document.createElement('div');
    iconWrapper.className = `marker-icon ${type}-icon`;

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = name;
    img.style.width = '36px';
    img.style.height = 'auto';
    img.style.pointerEvents = 'auto';
    img.style.filter = 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))';
    img.style.transition = 'all 0.3s ease';
    el.style.touchAction = 'manipulation';
    iconWrapper.appendChild(img);
    el.appendChild(iconWrapper);

    return el;
  };
  const updateMarkerStyles = (selectedId: string | null) => {
    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      const markerId = el.getAttribute('data-marker-id');
      const img = el.querySelector('img') as HTMLImageElement;
      if (!img || !markerId) return;

      if (selectedId === markerId) {
        applySelectedStyle(img);
      } else if (selectedId) {
        applyDimmedStyle(img);
      } else {
        applyDefaultStyle(img);
      }
    });
  };
  updateMarkerStyles(selectedMarkerIdRef.current);
  const getImageCoordinates = (
    mapBounds: [[number, number], [number, number]]
  ): [number, number][] => {
    const sw = xyToLngLat(mapBounds[0][1], mapBounds[0][0], mapBounds);
    const ne = xyToLngLat(mapBounds[1][1], mapBounds[1][0], mapBounds);
    return [
      [sw[0], ne[1]],
      [ne[0], ne[1]],
      [ne[0], sw[1]],
      [sw[0], sw[1]],
    ];
  };

  const addCustomImageLayer = useCallback(
    (map: mapboxgl.Map): Promise<void> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          try {
            const coordinates = getImageCoordinates(mapBounds);
            map.addSource(customMapSourceId, {
              type: 'image',
              url: mapImageUrl,
              coordinates,
            });
            map.addLayer({
              id: 'custom-map-layer',
              type: 'raster',
              source: customMapSourceId,
              paint: { 'raster-opacity': 1 },
            });
            resolve();
          } catch (err) {
            console.error('Failed to add custom map source/layer', err);
            reject(err);
          }
        };
        image.onerror = (err) => {
          console.error('Failed to load map image', err);
          reject(err);
        };
        image.src = mapImageUrl;
      });
    },
    [customMapSourceId, mapBounds, mapImageUrl]
  );

  const updateMarkers = useCallback(
    (map: mapboxgl.Map) => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const allValidPoints = [
        ...locations.filter(isValidCoord),
        ...foodPrintMarkers.filter(isValidCoord),
      ];
      if (allValidPoints.length === 0) return;

      const bounds = new mapboxgl.LngLatBounds();
      allValidPoints.forEach((p) => {
        const [lng, lat] = xyToLngLat(p.x, p.y, mapBounds);
        bounds.extend([lng, lat]);
      });

      // const sw = bounds.getSouthWest();
      // const ne = bounds.getNorthEast();
      // const lngPad = Math.abs(ne.lng - sw.lng) * 0.2;
      // const latPad = Math.abs(ne.lat - sw.lat) * 0.2;
      // const expandedBounds = new mapboxgl.LngLatBounds(
      //   [sw.lng - lngPad, sw.lat - latPad],
      //   [ne.lng + lngPad, ne.lat + latPad]
      // );
      const updateMarkerStyles = (selectedId: string | null) => {
        markersRef.current.forEach((marker) => {
          const el = marker.getElement();
          const markerId = el.getAttribute('data-marker-id');
          const img = el.querySelector('img') as HTMLImageElement;
          if (!img || !markerId) return;

          if (selectedId === markerId) {
            applySelectedStyle(img);
          } else if (selectedId) {
            applyDimmedStyle(img);
          } else {
            applyDefaultStyle(img);
          }
        });
      };

      locations.forEach((loc) => {
        if (!isValidCoord(loc)) return;
        const id = `location-${loc.name}-${loc.x}-${loc.y}`;
        const el = createMarkerElement(
          id,
          loc.name,
          loc.iconUrl || fallbackImage('location'),
          'location'
        );
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          popupRef.current?.remove();
          selectedMarkerIdRef.current = id;
          updateMarkerStyles(id);
          onLocationClick?.(loc);
        });

        const [lng, lat] = xyToLngLat(loc.x, loc.y, mapBounds);
        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);
      });

      foodPrintMarkers.forEach((fp) => {
        if (!isValidCoord(fp)) return;
        const id = `foodprint-${fp.name}-${fp.x}-${fp.y}`;
        const el = createMarkerElement(
          id,
          fp.name,
          fp.iconUrl || fallbackImage('foodprint'),
          'foodprint'
        );

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          popupRef.current?.remove();
          onFoodPrintClick?.(fp);
          selectedMarkerIdRef.current = id;
          updateMarkerStyles(id);
        });
        const [lng, lat] = xyToLngLat(fp.x, fp.y, mapBounds);
        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);
      });

      districts.forEach((d) => {
        if (!isValidCoord(d)) return;

        const el = document.createElement('div');
        el.className = 'custom-marker area-label-marker';

        // Use Tailwind responsive classes for font size
        const fontSize = 'text-sm sm:text-base md:text-lg lg:text-xl';

        el.innerHTML = `
          <span class="font-[500] ${fontSize} text-white text-center opacity-80 select-none"
            style="font-family: 'Open Sans', sans-serif;">
            ${d.name}
          </span>
        `;

        const [lng, lat] = xyToLngLat(d.x, d.y, mapBounds);
        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    },
    [
      locations,
      foodPrintMarkers,
      districts,
      mapBounds,
      // defaultZoom,
      onLocationClick,
      onFoodPrintClick,
      isDesktop,
    ]
  );

  const initializeMap = useCallback(() => {
    if (!mapboxToken || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      mapInitializedRef.current = false;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: useCustomMap ? 'mapbox://styles/mapbox/empty-v9' : mapStyle,
      zoom: defaultZoom,
      center: [0, 0],
      attributionControl: false,
      renderWorldCopies: false,
      interactive: true,
      dragRotate: false,
      pitch: 0,
      bearing: 0,
      maxBounds: [
        [-60, -60],
        [60, 60],
      ],
      minZoom: 1,
      maxZoom: 15,
    });

    if (isDesktop) {
      map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');
    }

    mapInstanceRef.current = map;
    mapInitializedRef.current = true;

    map.on('load', () => {
      if (useCustomMap) {
        addCustomImageLayer(map)
          .then(() => {
            updateMarkers(map);
            onMapLoaded?.();
          })
          .catch(() => {
            updateMarkers(map);
            onMapLoaded?.();
          });
      } else {
        updateMarkers(map);

        if (!hasFitBoundsRef.current) {
          const allValidPoints = [
            ...locations.filter(isValidCoord),
            ...foodPrintMarkers.filter(isValidCoord),
          ];

          const bounds = new mapboxgl.LngLatBounds();
          allValidPoints.forEach((p) => {
            bounds.extend(xyToLngLat(p.x, p.y, mapBounds));
          });

          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          const lngPad = Math.abs(ne.lng - sw.lng) * 0.2;
          const latPad = Math.abs(ne.lat - sw.lat) * 0.2;
          const expandedBounds = new mapboxgl.LngLatBounds(
            [sw.lng - lngPad, sw.lat - latPad],
            [ne.lng + lngPad, ne.lat + latPad]
          );

          try {
            map.fitBounds(expandedBounds, {
              padding: 100,
              maxZoom: defaultZoom < 3 ? defaultZoom : 3,
            });
            hasFitBoundsRef.current = true;
          } catch (err) {
            console.warn('Failed to fit bounds', err);
          }
        }

        onMapLoaded?.();
      }
    });

    map.on('zoom', () => {
      const zoom = map.getZoom();
      if (zoom < 1) map.setZoom(1);
      if (zoom > 15) map.setZoom(15);
    });
    map.on('rotate', () => map.setBearing(0));
    map.on('pitch', () => map.setPitch(0));
  }, [
    addCustomImageLayer,
    defaultZoom,
    foodPrintMarkers,
    isDesktop,
    locations,
    mapBounds,
    mapStyle,
    mapboxToken,
    onMapLoaded,
    updateMarkers,
    useCustomMap,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapInitializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInitializedRef.current || !mapInstanceRef.current) return;
    updateMarkers(mapInstanceRef.current);
  }, [locations, foodPrintMarkers, districts, updateMarkers]);

  return <div ref={mapContainerRef} className="map-container w-full h-full" />;
};
export default MapComponent;
