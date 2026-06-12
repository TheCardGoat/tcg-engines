import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiMysticalFighter as canonicalRafikiMysticalFighter } from "../../003";

export const rafikiMysticalFighter: CharacterCard = {
  ...canonicalRafikiMysticalFighter,
  id: "MwD",
  reprints: ["set3-054", "set9-036"],
  set: "009",
  cardNumber: 36,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_f0b125bab638401e834b91dc4577a894",
    tcgPlayer: 649983,
  },
};
