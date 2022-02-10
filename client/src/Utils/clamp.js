export function clamp(input, min, max) {
  return input < min ? min : input > max ? max : input;
}

export function mapRange(current, in_min, in_max, out_min, out_max) {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}
