"use client";

import React, { useRef } from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Sci_Fi_comp(props) {
  const { nodes, materials } = useGLTF('/models/Sci_Fi_Laptop.glb');
  const modelRef = useRef();

  const targetScale = [0.6, 0.6, 0.6];
  const initialScale = [0.1, 0.1, 0.1];

  // Animate scale and floating
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (modelRef.current) {
      // Smooth scale animation
      modelRef.current.scale.x += (targetScale[0] - modelRef.current.scale.x) * delta * 2;
      modelRef.current.scale.y += (targetScale[1] - modelRef.current.scale.y) * delta * 2;
      modelRef.current.scale.z += (targetScale[2] - modelRef.current.scale.z) * delta * 2;

      // Floating effect
      modelRef.current.position.y = -0.8 + Math.sin(t) * 0.2;
    }
  });

  return (
    <>
      {/* Model */}
      <group
        {...props}
        dispose={null}
        ref={modelRef}
        position={[0, -0.8, 0]}
        scale={initialScale}
        rotation={[0.25, 0, 0]}
      >
        <mesh
          name="Plane002_digital_displays_0"
          castShadow
          receiveShadow
          geometry={nodes.Plane002_digital_displays_0.geometry}
          material={materials.digital_displays}
          position={[0, 0.289, 3.122]}
          rotation={[-1.469, 0, 0]}
        />
        <mesh
          name="Plane002_digital_display_sides_0"
          castShadow
          receiveShadow
          geometry={nodes.Plane002_digital_display_sides_0.geometry}
          material={materials.digital_display_sides}
          position={[0, 0.289, 3.122]}
          rotation={[-1.469, 0, 0]}
        />
        <mesh
          name="Circle_metal_2_0"
          castShadow
          receiveShadow
          geometry={nodes.Circle_metal_2_0.geometry}
          material={materials.metal_2}
          position={[0, 0, -0.948]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.238}
        />
        <mesh
          name="Circle_metal_1_0"
          castShadow
          receiveShadow
          geometry={nodes.Circle_metal_1_0.geometry}
          material={materials.metal_1}
          position={[0, 0, -0.948]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.238}
        />
      </group>

      {/* Enable mouse drag rotation */}
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={false}
        rotateSpeed={0.8}
        dampingFactor={0.1}
      />
    </>
  );
}

useGLTF.preload('/models/Sci_Fi_Laptop.glb');
