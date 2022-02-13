import React, { useRef, useState, useEffect, Suspense } from "react";
import { OrbitControls, Stats, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Model from "./pepsi_bottle/Pepsi_bottle";
import Iphone from "./pepsi_bottle/Iphone";
import Loading from "./Loading";
import * as THREE from "three";
import { mapRange } from "../Utils/clamp";
function ThreeModel({ setModel, Model, recievedData }) {
  const { size, camera, scene } = useThree();
  const animationRef = React.useRef();

  useEffect(() => {
    window.Model = Model;
    window.THREE = THREE;
   

    if (Model && Model.rotation && Model.quaternion && recievedData) {
    
      if (recievedData.type=="quaternion") {
        //Model.quaternion.fromArray(recievedData.quaternion)
       //Model.setRotationFromQuaternion(recievedData.quaternion)
       scene.rotation.y = 183 * Math.PI/180;
scene.rotation.z = -48 * Math.PI/180;
scene.rotation.x = 80 * Math.PI/180;
scene.position.x=-20
scene.position.y=-15
scene.position.z=50
       Model.setRotationFromEuler(
        // new THREE.Euler().setFromQuaternion(recievedData.quaternion)
        new THREE.Euler().setFromQuaternion(new THREE.Quaternion(...recievedData.quaternion))
      );
    
      
      } else if (
        recievedData.type=="accelero"
      ) {
        scene.setRotationFromEuler( new THREE.Euler(
          // Math.PI/180*(recievedData.angle)
          0,
         0,
        0,

          "XYZ"
        ))
        scene.position.x=0
        scene.position.y=0
        scene.position.z=0
        const inDegree=mapRange(recievedData.rotationState?.acc.x,-9.8,9.8,-90,90)
        const z= Math.PI/180*inDegree
        console.log({z,inDegree})
        Model.setRotationFromEuler(
          new THREE.Euler(
            // Math.PI/180*(recievedData.angle)
            0,
           0,
          z,
 
            "XYZ"
          )
        );
      } else if(recievedData.type=="custom") {
        scene.setRotationFromEuler( new THREE.Euler(
          // Math.PI/180*(recievedData.angle)
          0,
         0,
        0,

          "XYZ"
        ))
        scene.position.x=0
scene.position.y=0
scene.position.z=0

        Model.setRotationFromEuler(new THREE.Euler(0, 0, Math.PI/180*(360-recievedData.angle), "XYZ"));
        //Model.rotateZ(recievedData.angle);
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

  // useEffect(() => {
  //   window.Model = Model;
  //   window.THREE = THREE;
  //    function animate(recievedData,Model){
       
  //   function animateFunction()
  //   {
  //       // updateAnimation();
  //       console.log(recievedData)
  //       if (Model && Model.rotation && Model.quaternion && recievedData) {
        
  //         if (recievedData.quaternion) {
  //           Model.quaternion.fromArray(recievedData.quaternion);
  //         } else if (
  //           recievedData.type.includes("landscape") ||
  //           recievedData.type.includes("portrait")
  //         ) {
  //           const z= Math.PI/180*mapRange(recievedData.rotationState?.acc.x,-9.8,9.8,-90,90)
  //           // console.log(z,mapRange(recievedData.rotationState?.acc.x,-9.8,9.8,0,360).toFixed(2))
  //           Model.setRotationFromEuler(
  //             new THREE.Euler(
  //               // Math.PI/180*(recievedData.angle)
  //               0,
  //              0,
  //             z,
  //               "XYZ"
  //             )
  //           );
  //         } else if(recievedData.type=="custom") {
  //           Model.setRotationFromEuler(new THREE.Euler(0, 0, Math.PI/180*(360-recievedData.angle), "XYZ"));
  //           //Model.rotateZ(recievedData.angle);
  //         }
  //       }
  //       animationRef.current=requestAnimationFrame(animateFunction);
    
  //   }
    
  //     animationRef.current=requestAnimationFrame(animateFunction);
  //    }
  //    animate(recievedData,Model)
  //   return () => {
  //    cancelAnimationFrame(animationRef.current)
  //   }
  // }, [recievedData,Model,animationRef])
  

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
