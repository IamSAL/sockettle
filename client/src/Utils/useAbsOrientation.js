/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";

export function useAbsOrientation() {
  const [quaternion, setquaternion] = useState([]);
  useEffect(() => {
    const sensor = new AbsoluteOrientationSensor();
    Promise.all([
      navigator.permissions.query({ name: "accelerometer" }),
      navigator.permissions.query({ name: "magnetometer" }),
      navigator.permissions.query({ name: "gyroscope" }),
    ]).then((results) => {
      if (results.every((result) => result.state === "granted")) {
        sensor.addEventListener("reading", () => {
          setquaternion(sensor.quaternion);
        });
        sensor.addEventListener("error", (error) => {
          if (event.error.name == "NotReadableError") {
            console.log("Sensor is not available.");
          }
        });
        sensor.start();
      } else {
        console.log("No permissions to use AbsoluteOrientationSensor.");
      }
    });

    return () => sensor.stop();
  }, []); // Empty array ensures that effect is only run on mount
  return quaternion;
}
