export function accelDenoise(acceleration) {
  //ramp-speed - play with this value until satisfied
  let kFilteringFactor = 0.1;

  //last result storage - keep definition outside of this function, eg. in wrapping object
  let accel = [1, 1, 1];
  let result = {};
  //acceleration.x,.y,.z is the input from the sensor

  //result.x,.y,.z is the filtered result

  //high-pass filter to eliminate gravity
  accel[0] =
    acceleration.x * kFilteringFactor + accel[0] * (1.0 - kFilteringFactor);
  accel[1] =
    acceleration.y * kFilteringFactor + accel[1] * (1.0 - kFilteringFactor);
  accel[2] =
    acceleration.z * kFilteringFactor + accel[2] * (1.0 - kFilteringFactor);
  result.x = acceleration.x - accel[0];
  result.y = acceleration.y - accel[1];
  result.z = acceleration.z - accel[2];

  return result;
}
