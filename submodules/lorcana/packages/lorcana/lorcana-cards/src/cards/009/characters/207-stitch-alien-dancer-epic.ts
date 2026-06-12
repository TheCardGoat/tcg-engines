import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienDancer } from "../../004";

export const stitchAlienDancerEpic: CharacterCard = {
  ...stitchAlienDancer,
  id: "0aP",
  reprints: ["set4-023", "set9-009"],
  set: "009",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_6ccc388f32064927a08d9914aad4bc8f",
    tcgPlayer: 650143,
  },
};
