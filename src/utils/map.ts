export function calculateDistance(latBeg:number, lonBeg:number, latEnd:number, lonEnd:number) {
  const R = 6371e3; // Rayon de la Terre en mètres

  const dLat = (latEnd - latBeg) * Math.PI / 180;
  const dLon = (lonEnd - lonBeg) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(latBeg) * Math.cos(latEnd);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}