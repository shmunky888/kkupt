// src/components/ui/AvatarCircle.jsx
// Description: Colored avatar circle derived deterministically from a name string.

import React from 'react';

export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

const AvatarCircle = ({ name = "?", size = 40 }) => {
  const char = name.substring(0, 2).toUpperCase();
  const bgColor = stringToColor(name);
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ width: size, height: size, backgroundColor: bgColor, fontSize: size > 30 ? '14px' : '10px' }}
    >
      {char}
    </div>
  );
};

export default AvatarCircle;
