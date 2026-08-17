"use client";

import { Environment, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Box3, MathUtils, PerspectiveCamera as ThreePerspectiveCamera, Sphere, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGltfModelLoad, GltfPreload } from "@/lib/three/GltfLoader";
import * as THREE from 'three'

const DEFAULT_CAMERA_DIRECTION = new Vector3(1, 0.7, 1).normalize();
const MIN_CAMERA_DISTANCE = 0.75;

function Loading() {
  return (
    <Html center>
      <p className="rounded-md bg-slate-900/80 px-3 py-2 text-sm text-slate-100">
        Loading...
      </p>
    </Html>
  );
}

function computeFrameDistance(camera: ThreePerspectiveCamera, radius: number, aspect: number) {
  const verticalFov = MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const safeRadius = Math.max(radius, 0.01);

  return Math.max(
    safeRadius / Math.sin(verticalFov / 2),
    safeRadius / Math.sin(horizontalFov / 2),
    MIN_CAMERA_DISTANCE,
  );
}

function ModelScene({ assetUrl, backgroundColor }: { assetUrl: string; backgroundColor: string }) {
  const { scene } = useGltfModelLoad(assetUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const { camera } = useThree();
  const pCamera = camera as THREE.PerspectiveCamera;
  pCamera.fov = 45;
  pCamera.updateProjectionMatrix();

  useLayoutEffect(() => {
    if (!(pCamera instanceof ThreePerspectiveCamera)) {
      return;
    }

    const camera = pCamera;

    clonedScene.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(clonedScene);
    if (box.isEmpty()) {
      return;
    }

    const bounds = box.getBoundingSphere(new Sphere());
    const radius = Math.max(bounds.radius, 0.5);
    const framedDistance =
      computeFrameDistance(camera, radius, size.width / Math.max(size.height, 1)) * 1.2;
    const cameraPosition = bounds.center
      .clone()
      .add(DEFAULT_CAMERA_DIRECTION.clone().multiplyScalar(framedDistance));

    camera.position.copy(cameraPosition);
    camera.near = Math.max(0.1, framedDistance / 100);
    camera.far = Math.max(framedDistance * 8, radius * 16);
    camera.updateProjectionMatrix();
    camera.lookAt(bounds.center);
    camera.updateMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(bounds.center);
      controlsRef.current.minDistance = Math.max(radius * 1.25, MIN_CAMERA_DISTANCE);
      controlsRef.current.maxDistance = Math.max(framedDistance * 3.5, radius * 8);
      controlsRef.current.update();

    }
  }, [camera, size.height, size.width]);


  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <OrbitControls ref={controlsRef} enablePan={false} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={1.75} />
      <directionalLight position={[-5, 3, -4]} intensity={0.55} />
      <Environment preset="studio" />
      <primitive object={clonedScene} />
    </>
  );
}

export default function ModelViewer({
  assetUrl,
  backgroundColor,
}: {
  assetUrl: string;
  backgroundColor: string;
}) {
  GltfPreload(assetUrl);

  return (
    <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <Canvas>
        <Suspense fallback={<Loading />}>
          <ModelScene assetUrl={assetUrl} backgroundColor={backgroundColor} />
        </Suspense>
      </Canvas>
    </div>
  );
}
