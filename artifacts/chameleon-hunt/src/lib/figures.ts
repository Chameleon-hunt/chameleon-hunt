export type Figure = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  hint: string;
};

export const FIGURES: Figure[] = [
  { id: 1,  name: "Chameleon #1",  lat: 32.77737957724089,  lng: 34.99163523310902,  hint: "Look around carefully — it's closer than you think" },
  { id: 2,  name: "Chameleon #2",  lat: 32.77430797763679,  lng: 34.991229343214016, hint: "Check the surroundings — small but colorful" },
  { id: 3,  name: "Chameleon #3",  lat: 32.77507561478129,  lng: 34.99309653636095,  hint: "It blends in, but not for long" },
  // #4 removed
  { id: 5,  name: "Chameleon #5",  lat: 32.7755739,          lng: 34.9915637,         hint: "Stay sharp — this one is sneaky" },
  { id: 6,  name: "Chameleon #6",  lat: 32.7789073,          lng: 34.9916747,         hint: "A colorful surprise in the neighborhood" },
  { id: 7,  name: "Chameleon #7",  lat: 32.77734205751203,   lng: 34.991828438686056, hint: "Look low, look high, look everywhere" },
  { id: 8,  name: "Chameleon #8",  lat: 32.776150854921255,  lng: 34.991898729145774, hint: "A colorful surprise in the neighborhood" },
  { id: 9,  name: "Chameleon #9",  lat: 32.789780312026174,  lng: 35.006741434140686, hint: "Shopping mall — Floor 1, near Fox store" },
  { id: 10, name: "Chameleon #10", lat: 32.789780312026174,  lng: 35.006741434140686, hint: "Shopping mall — Floor 1, near the bench by Fox" },
  { id: 11, name: "Chameleon #11", lat: 32.789780312026174,  lng: 35.006741434140686, hint: "Shopping mall — Floor 1, near the bench (check both sides!)" },
];

export const getFigureLocation = (f: Figure): [number, number] => {
  let lat = f.lat;
  let lng = f.lng;
  // Tiny offsets for mall figures so they're all separately clickable
  if (f.id === 10) { lat += 0.0001; lng += 0.0001; }
  if (f.id === 11) { lat -= 0.0001; lng -= 0.0001; }
  return [lat, lng];
};
