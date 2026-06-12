import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienDancer as canonicalStitchAlienDancer } from "../../004";

export const stitchAlienDancer: CharacterCard = {
  ...canonicalStitchAlienDancer,
  id: "Zo3",
  reprints: ["set4-023", "set9-009"],
  set: "009",
  cardNumber: 9,
  rarity: "common",
  externalIds: {
    lorcast: "crd_6ccc388f32064927a08d9914aad4bc8f",
    tcgPlayer: 650143,
  },
};
