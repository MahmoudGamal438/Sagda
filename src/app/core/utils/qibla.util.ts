const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function qiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLambda = toRad(KAABA_LNG - lng);
  const y = Math.sin(dLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function compassDelta(heading: number, qibla: number): number {
  let d = qibla - heading;
  while (d > 180) {
    d -= 360;
  }
  while (d < -180) {
    d += 360;
  }
  return d;
}
