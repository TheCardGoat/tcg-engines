import type { CharacterCard } from "@tcg/lorcana-types";
import { mamaOdieMysticalMaven as canonicalMamaOdieMysticalMaven } from "../../003";

export const mamaOdieMysticalMaven: CharacterCard = {
  ...canonicalMamaOdieMysticalMaven,
  id: "gTd",
  reprints: ["set3-151", "set9-152"],
  set: "009",
  cardNumber: 152,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_901fa7746b2745bc84aa4c7c6fddbbc7",
    tcgPlayer: 650087,
  },
};
