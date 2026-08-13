// src/lib/three/ktx2-loader.ts
import * as THREE from "three";
import { KTX2Loader } from "three-stdlib";

export const KTX2_TRANSCODER_PATH = "/basis/" as const;

let cachedKtx2Loader: KTX2Loader | null = null;

export function getKtx2Loader(): KTX2Loader {
    if (cachedKtx2Loader) return cachedKtx2Loader;

    const tempRenderer = new THREE.WebGLRenderer();
    const loader = new KTX2Loader();
    loader.setTranscoderPath(KTX2_TRANSCODER_PATH);
    loader.detectSupport(tempRenderer);
    tempRenderer.dispose();

    cachedKtx2Loader = loader;
    return loader;
}