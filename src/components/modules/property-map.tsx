"use client";
import { useEffect, useRef, useCallback } from "react";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function PropertyMap({
  properties,
  center = [-6.2088, 106.8456],
  zoom = 11,
  className = "",
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const initMap = useCallback(async () => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import — avoids SSR issues completely
    const L = (await import("leaflet")).default;

    // Fix broken default icon paths in webpack/Next.js builds
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    // Create map
    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapRef.current = map;

    // Tile layer (OpenStreetMap — free, no API key needed)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    addMarkers(L, map);

    // Fit bounds if multiple properties with coords
    const withCoords = properties.filter((p) => p.latitude && p.longitude);
    if (withCoords.length > 1) {
      const bounds = L.latLngBounds(
        withCoords.map((p) => [p.latitude!, p.longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }
  }, []);

  const addMarkers = useCallback((L: any, map: any) => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const priceLabel = formatPrice(p.price);

      // Custom price-label icon
      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            background: #000802;
            color: white;
            border-radius: 999px;
            padding: 5px 12px;
            font-size: 11px;
            font-weight: 900;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,8,2,0.35);
            border: 2px solid #10b981;
            font-family: 'Plus Jakarta Sans', sans-serif;
            cursor: pointer;
            user-select: none;
            transition: transform 0.15s;
          ">${priceLabel}</div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
        popupAnchor: [0, -18],
      });

      // Popup content
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 220px; border-radius: 12px; overflow: hidden;">
          ${
            p.main_image_url
              ? `<img src="${p.main_image_url}" style="width:100%;height:110px;object-fit:cover;display:block;" alt="" />`
              : ""
          }
          <div style="padding: 12px;">
            <p style="font-size:13px;font-weight:800;color:#000802;margin:0 0 4px;line-height:1.3;">
              ${p.title}
            </p>
            <p style="font-size:11px;color:#476083;margin:0 0 8px;display:flex;align-items:center;gap:4px;">
              📍 ${p.address}, ${p.city}
            </p>
            <p style="font-size:15px;font-weight:900;color:#10b981;margin:0 0 10px;">
              ${priceLabel}${p.listing_type === "rent" ? "<span style='font-size:10px;color:#74777f;font-weight:500'>/bln</span>" : ""}
            </p>
            <div style="display:flex;gap:8px;margin-bottom:10px;font-size:11px;color:#476083;">
              ${p.bedrooms > 0 ? `<span>🛏 ${p.bedrooms}</span>` : ""}
              ${p.bathrooms > 0 ? `<span>🚿 ${p.bathrooms}</span>` : ""}
              ${p.building_size ? `<span>📐 ${p.building_size}m²</span>` : ""}
            </div>
            <a href="/properties/${p.slug}" 
               style="
                display:block;text-align:center;
                background:#000802;color:white;
                padding:8px;border-radius:8px;
                text-decoration:none;font-size:12px;
                font-weight:700;
              ">
              Lihat Detail →
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(map)
        .bindPopup(popupHtml, {
          maxWidth: 240,
          minWidth: 220,
          className: "nexpro-popup",
        });

      markersRef.current.push(marker);
    });
  }, [properties]);

  useEffect(() => {
    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when properties change after initial mount
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((mod) => {
      addMarkers(mod.default, mapRef.current);
    });
  }, [properties]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        crossOrigin="anonymous"
      />
      {/* Custom popup styles */}
      <style>{`
        .nexpro-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e1e3e4;
          box-shadow: 0 8px 32px rgba(0,8,2,0.15);
        }
        .nexpro-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .nexpro-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          border: 1px solid #e1e3e4 !important;
          color: #000802 !important;
          font-weight: 700 !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className={`w-full h-full ${className}`}
        style={{ minHeight: "400px" }}
      />
    </>
  );
}
