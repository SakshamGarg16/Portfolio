"use client";

import React from "react";

const AboutGrid = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* Personal Info */}
      <div className="bg-background rounded-lg p-6 shadow-lg border border-accent/30">
        <h2 className="text-xl font-semibold text-foreground mb-4">About Me</h2>
        <p className="text-muted">
          Hey! I'm Saksham Garg, a passionate developer with a focus on AI and
          web technologies.
        </p>
      </div>

      {/* 3D Model */}
      <div className="h-[300px] bg-background rounded-lg shadow-lg border border-accent/30">
        {/* Placeholder for 3D model */}
        <div className="w-full h-full flex items-center justify-center">
          {/* Example: <RenderModel><Sci_Fi_comp /></RenderModel> */}
        </div>
      </div>
    </section>
  );
};

export default AboutGrid;
