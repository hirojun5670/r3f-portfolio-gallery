"use client";

import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

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
  const { gl } = useThree();
  const ktx2Loader = useMemo(() => {
    const loader = new KTX2Loader();
    loader.setTranscoderPath(
      "https://unpkg.com/three@0.185.1/examples/jsm/libs/basis/",
    );
    loader.detectSupport(gl);
    return loader;
  }, [gl]);

  useEffect(() => {
    return () => {
      ktx2Loader.dispose();
    };
  }, [ktx2Loader]);

  const { scene } = useGLTF(assetUrl, undefined, undefined, (loader) => {
    loader.setKTX2Loader(ktx2Loader);
  });
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
