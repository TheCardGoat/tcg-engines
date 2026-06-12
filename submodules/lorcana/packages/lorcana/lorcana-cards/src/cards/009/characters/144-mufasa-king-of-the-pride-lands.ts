import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaKingOfThePrideLands as canonicalMufasaKingOfThePrideLands } from "../../001";

export const mufasaKingOfThePrideLands: CharacterCard = {
  ...canonicalMufasaKingOfThePrideLands,
  id: "YGq",
  reprints: ["set1-155", "set9-144"],
  set: "009",
  cardNumber: 144,
  rarity: "common",
  externalIds: {
    lorcast: "crd_b7423a2c84b542a58d2605d3a6c28b2b",
    tcgPlayer: 650079,
  },
};
