"use client";

import { Environment, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Box3, MathUtils, PerspectiveCamera as ThreePerspectiveCamera, Sphere, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGltfModelLoad, GltfPreload } from "@/lib/three/GltfLoader";

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

function ModelScene({ assetUrl }: { assetUrl: string }) {
  const { scene } = useGltfModelLoad(assetUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { size } = useThree();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useLayoutEffect(() => {
    if (!(cameraRef.current instanceof ThreePerspectiveCamera)) {
      return;
    }

    const camera = cameraRef.current;

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
    camera.lookAt(bounds.center);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(bounds.center);
      controlsRef.current.minDistance = Math.max(radius * 1.25, MIN_CAMERA_DISTANCE);
      controlsRef.current.maxDistance = Math.max(framedDistance * 3.5, radius * 8);
      controlsRef.current.update();
    }
  }, [clonedScene, size.height, size.width]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} position={[0, 1.2, 3.2]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={1.75} />
      <directionalLight position={[-5, 3, -4]} intensity={0.55} />
      <Environment preset="studio" />
      <primitive object={clonedScene} />
      <OrbitControls ref={controlsRef} enablePan={false} />
    </>
  );
}

export default function ModelViewer({ assetUrl }: { assetUrl: string }) {
  GltfPreload(assetUrl);

  return (
    <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <Canvas>
        <Suspense fallback={<Loading />}>
          <ModelScene assetUrl={assetUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
