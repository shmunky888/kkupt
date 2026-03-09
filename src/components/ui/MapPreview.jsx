// src/components/ui/MapPreview.jsx
// Description: Toggle-able map embed (OpenStreetMap iframe) with Google Maps navigation link.

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const MapPreview = ({ lat, lng, mapLink, locationName }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-2">
      <button onClick={() => setShow(!show)} className="flex items-center gap-1 text-sm text-[#F58220] hover:underline mb-2">
        <MapPin size={16} /> <span>{locationName}</span>
      </button>

      {show && (
        <div className="rounded-xl overflow-hidden border border-gray-200 mt-2">
          {lat && lng ? (
            <div>
              <iframe
                title="map"
                width="100%"
                height="200"
                className="border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
              />
              <div className="bg-gray-50 p-2 text-center text-sm border-t border-gray-200">
                <a href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noreferrer" style={{color: "#F58220"}} className="font-semibold px-4 py-1 inline-block">นำทาง</a>
              </div>
            </div>
          ) : mapLink ? (
            <div className="p-4 bg-gray-50 text-center">
              <a href={mapLink} target="_blank" rel="noreferrer" style={{color: "#F58220"}} className="font-semibold underline">ดูแผนที่</a>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 text-center text-gray-500 text-sm">
              ไม่มีข้อมูลแผนที่
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapPreview;
