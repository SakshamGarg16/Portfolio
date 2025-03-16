"use client";

import { useState, useEffect } from "react";

export default function FlashlightBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1920x1080/?galaxy')",
        }}
      ></div>

      {/* Flashlight Mask with reduced darkness */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Reduced darkness
          maskImage: `radial-gradient(circle 300px at ${position.x}px ${position.y}px, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 70%)`,
          WebkitMaskImage: `radial-gradient(circle 300px at ${position.x}px ${position.y}px, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 70%)`,
        }}
      />
    </div>
  );
}
