import React, { useRef, useState, useEffect, Suspense } from "react";
import { OrbitControls, Stats, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Model from "./pepsi_bottle/Pepsi_bottle";
import Iphone from "./pepsi_bottle/Iphone";
import Loading from "./Loading";
import * as THREE from "three";
function ThreeModel({ setModel, Model, recievedData }) {
  const { size, camera, scene } = useThree();

  useEffect(() => {
    window.Model = Model;
    window.THREE = THREE;
    console.log({ Model });
    if (Model && Model.rotation && Model.quaternion && recievedData) {
      console.log(Model, Model.rotation, Model.quaternion, Model.rotation.x);
      if (recievedData.quaternion) {
        Model.quaternion.fromArray(recievedData.quaternion);
      } else if (
        recievedData.type.includes("landscape") ||
        recievedData.type.includes("portrait")
      ) {
        Model.setRotationFromEuler(
          new THREE.Euler(
            recievedData.rotationState?.roll,
            recievedData.rotationState?.pitch,
            recievedData.rotationState?.yaw,
            "XYZ"
          )
        );
      } else {
        Model.setRotationFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
        Model.rotateZ(recievedData.angle);
      }
    }
    return () => {};
  }, [recievedData, Model]);

  function findModel(scene) {
    const finder = setInterval(() => {
      const phone = scene.children.find((c) => c.name == "myphone");
      if (phone) {
        phone.position.y = -35;
        camera.zoom = 2;
        camera.updateProjectionMatrix();
        setModel(phone);
        clearInterval(finder);
      }
    }, 500);
  }
  useEffect(() => {
    window.camera = camera;
    window.scene = scene;
    findModel(scene);

    return () => {};
  }, [camera, scene, Model]);

  return (
    <>
      <ambientLight />
      <pointLight position={[20, 10, 20]} />
      <OrbitControls />
      <FillLight brightness={1.6} color={"#bdefff"} />
      <RimLight brightness={24} color={"#fff"} />

      <Suspense
        fallback={
          <Html>
            <Loading />
          </Html>
        }
      >
        {/* <Model /> */}
        <Iphone />
      </Suspense>
      {/* <Stats /> */}
    </>
  );
}

function KeyLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      color={color}
      intensity={brightness}
      position={[-2, 0, 5]}
      lookAt={[0, 0, 0]}
      penumbra={1}
      castShadow
    />
  );
}
function FillLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      intensity={brightness}
      color={color}
      position={[2, 1, 4]}
      lookAt={[0, 0, 0]}
      penumbra={2}
      castShadow
    />
  );
}

function RimLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={2}
      height={2}
      intensity={brightness}
      color={color}
      position={[1, 4, -2]}
      rotation={[0, 180, 0]}
      castShadow
    />
  );
}
export default ThreeModel;
