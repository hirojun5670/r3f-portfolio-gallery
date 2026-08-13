import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei'
import { getKtx2Loader } from './ktx2-loader'
import type { WebGLRenderer } from 'three';


// 事前ローダー
export function GltfPreload(modelPath: string) {
    useEffect(() => {
        useGLTF.preload(modelPath, false, true, (loader) => {
            loader.setKTX2Loader(getKtx2Loader())
        })
    }, [modelPath])

    return null
}

// シーンの構築
export function useGltfModelLoad(modelPath: string) {
    return useGLTF(modelPath, undefined, true, (loader) => {
        loader.setKTX2Loader(getKtx2Loader())
    })
}