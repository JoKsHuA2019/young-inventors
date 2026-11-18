export function sensorReading(shade: number) {
  return Math.round(850 - shade * 6.5);
}
export function echoDistance(distance: number, missing: boolean) {
  return missing || distance < 5 || distance > 100 ? null : distance;
}
export function lampForThreshold(
  reading: number,
  threshold: number,
  box = false,
) {
  return box ? reading > threshold : reading < threshold;
}
export function linkagePoints(angle: number, short = false) {
  const a = (angle * Math.PI) / 180,
    Ax = 0,
    Ay = 0,
    Dx = 10,
    Dy = 0,
    Bx = 4 * Math.cos(a),
    By = 4 * Math.sin(a),
    r = short ? 9 : 10,
    s = 8;
  const dx = Dx - Bx,
    dy = Dy - By,
    d = Math.hypot(dx, dy);
  const t = (r * r - s * s + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, r * r - t * t)),
    Cx = Bx + (t * dx) / d - (h * dy) / d,
    Cy = By + (t * dy) / d + (h * dx) / d;
  return {
    A: [Ax, Ay],
    B: [Bx, By],
    C: [Cx, Cy],
    D: [Dx, Dy],
    M: [(Bx + Cx) / 2, (By + Cy) / 2],
  };
}
