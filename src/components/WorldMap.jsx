import { useEffect, useRef } from "react";
import { getCountryCoordinates, getCountryFlag } from "../utils/countryUtils";
import "leaflet/dist/leaflet.css";

function WorldMap({ magnets, unlockedId, onLockedClick, onUnlockedClick, isAdmin }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let map = mapInstanceRef.current;

    import("leaflet").then(L => {
      // Inicializa el mapa solo si no existe
      if (!mapInstanceRef.current) {
        map = L.map(mapRef.current, {
          center: [48, 15],
          zoom: 4,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          className: "map-tiles",
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      // Elimina marcadores anteriores
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Añade marcadores actualizados
      magnets.forEach(magnet => {
        const coords = getCountryCoordinates(magnet.country, magnet.city);
        if (!coords) return;

        const isUnlocked = isAdmin || magnet.id === unlockedId;
        const flag = getCountryFlag(magnet.country);

        const iconHtml = magnet.coverPhoto
          ? `<div style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              overflow: hidden;
              border: 3px solid ${isUnlocked ? "#fff" : "#6b7280"};
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              filter: ${isUnlocked ? "none" : "grayscale(80%) brightness(0.6)"};
              position: relative;
            ">
              <img src="${magnet.coverPhoto.url}" style="width:100%;height:100%;object-fit:cover;" />
              ${!isUnlocked ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:18px;">🔒</div>' : ""}
            </div>`
          : `<div style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: ${isUnlocked ? "#1e40af" : "#374151"};
              border: 3px solid ${isUnlocked ? "#fff" : "#6b7280"};
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              filter: ${isUnlocked ? "none" : "grayscale(80%) brightness(0.6)"};
            ">${flag}</div>`;

        const icon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          popupAnchor: [0, -28],
        });

        const marker = L.marker(coords, { icon }).addTo(mapInstanceRef.current);

        marker.on("click", () => {
          if (isUnlocked) {
            onUnlockedClick(magnet);
          } else {
            onLockedClick(magnet);
          }
        });

        marker.bindTooltip(
          `<div style="text-align:center;font-weight:bold">${flag} ${magnet.city}</div>
           <div style="text-align:center;font-size:12px;color:#9ca3af">${magnet.country}</div>
           ${!isUnlocked ? '<div style="text-align:center;font-size:11px;color:#ef4444;margin-top:2px">🔒 Escanea el NFC</div>' : ""}`,
          { direction: "top", offset: [0, -30] }
        );

        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [magnets]); // 👈 se re-ejecuta cada vez que cambian los magnets

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "16px", overflow: "hidden" }}
    />
  );
}

export default WorldMap;