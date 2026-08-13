"use client";

import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";

function Loading() {
  return (
    <Html center>
      <p className="rounded-md bg-slate-900/80 px-3 py-2 text-sm text-slate-100">
        Loading...
      </p>
    </Html>
  );
}

function Model({ assetUrl }: { assetUrl: string }) {
  const { scene } = useGLTF(assetUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return <primitive object={clonedScene} />;
}

export default function ModelViewer({ assetUrl }: { assetUrl: string }) {
  useEffect(() => {
    useGLTF.preload(assetUrl);
  }, [assetUrl]);

  return (
    <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <Canvas camera={{ position: [0, 1.2, 3.2], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <Suspense fallback={<Loading />}>
          <Model assetUrl={assetUrl} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
