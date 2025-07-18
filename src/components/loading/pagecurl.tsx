'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';

// Custom ShaderMaterial with curl effect
const PageCurlMaterial = shaderMaterial(
  {
    iResolution: new THREE.Vector2(),
    iMouse: new THREE.Vector4(),
    iChannel0: null,
    iChannel1: null,
    time: 0,
  },
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  glsl`
    #define pi 3.14159265359
    #define radius .1

    uniform vec2 iResolution;
    uniform vec4 iMouse;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform float time;

    varying vec2 vUv;

    void main() {
      float aspect = iResolution.x / iResolution.y;
      vec2 uv = vUv * vec2(aspect, 1.0);
      vec2 mouse = iMouse.xy * vec2(aspect, 1.0);
      vec2 mouseDir = normalize(abs(iMouse.zw) - iMouse.xy);
      vec2 origin = clamp(mouse - mouseDir * mouse.x / mouseDir.x, 0.0, 1.0);

      float mouseDist = clamp(length(mouse - origin) + (aspect - (abs(iMouse.z) / iResolution.x) * aspect) / mouseDir.x, 0.0, aspect / mouseDir.x);

      if (mouseDir.x < 0.0) {
        mouseDist = distance(mouse, origin);
      }

      float proj = dot(uv - origin, mouseDir);
      float dist = proj - mouseDist;
      vec2 linePoint = uv - dist * mouseDir;

      vec4 color;
      if (dist > radius) {
        color = texture2D(iChannel1, vUv);
        color.rgb *= pow(clamp(dist - radius, 0.0, 1.0) * 1.5, 0.2);
      } else if (dist >= 0.0) {
        float theta = asin(dist / radius);
        vec2 p2 = linePoint + mouseDir * (pi - theta) * radius;
        vec2 p1 = linePoint + mouseDir * theta * radius;
        uv = (p2.x <= aspect && p2.y <= 1. && p2.x > 0. && p2.y > 0.) ? p2 : p1;
        color = texture2D(iChannel0, uv);
        color.rgb *= pow(clamp((radius - dist) / radius, 0.0, 1.0), 0.2);
      } else {
        vec2 p = linePoint + mouseDir * (abs(dist) + pi * radius);
        uv = (p.x <= aspect && p.y <= 1. && p.x > 0. && p.y > 0.) ? p : uv;
        color = texture2D(iChannel0, uv);
      }

      gl_FragColor = color;
    }
  `
);

// Register shader material as JSX component
extend({ PageCurlMaterial });

function Plane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const [texture0, setTexture0] = useState<THREE.Texture | null>(null);
  const [texture1, setTexture1] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/images/map/foodprint-splash.png', setTexture0);
    loader.load('/images/map/Map.webp', setTexture1);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime();
      ref.current.uniforms.iResolution.value.set(size.width, size.height);
      ref.current.uniforms.iMouse.value.set(0.5, 0.5, 0.6, 0.4); // mock interaction
    }
  });

  if (!texture0 || !texture1) return null;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore: because TypeScript doesn't know this custom tag */}
      <pageCurlMaterial ref={ref} iChannel0={texture0} iChannel1={texture1} />
    </mesh>
  );
}

type PageTransitionProps = {
  onComplete: () => void;
};

const PageTransition = ({ onComplete }: PageTransitionProps) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 3000); // adjust timing as needed
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50">
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <Plane />
      </Canvas>
    </div>
  );
};

export default PageTransition;
