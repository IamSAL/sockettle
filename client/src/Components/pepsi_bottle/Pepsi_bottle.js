/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: akashsingh2508 (https://sketchfab.com/akashsingh2508)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/pepsi-bottle-2b807dda52eb4235a0625f79c9851c15
title: Pepsi_Bottle
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/pepsi_bottle.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.polySurface4_phong4_0.geometry} material={nodes.polySurface4_phong4_0.material} />
          <mesh geometry={nodes.polySurface5_Bottle_Mat_0.geometry} material={materials.Bottle_Mat} />
          <mesh geometry={nodes.polySurface6_phong4_0.geometry} material={nodes.polySurface6_phong4_0.material} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/pepsi_bottle.gltf')
