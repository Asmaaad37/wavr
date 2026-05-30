const generateDiceBearAvataaars = (seed) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;

const generateDiceBearBottts = (seed) =>
  `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;

const generateDiceBearPixelArt = (seed) =>
  `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 3; i++) {
    data.push(generateDiceBearAvataaars(Math.random()));
  }
  for (let i = 0; i < 3; i++) {
    data.push(generateDiceBearBottts(Math.random()));
  }
  for (let i = 0; i < 3; i++) {
    data.push(generateDiceBearPixelArt(Math.random()));
  }
  return data;
};