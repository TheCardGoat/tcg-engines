import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinPrinceAli as canonicalAladdinPrinceAli } from "../../001";

export const aladdinPrinceAli: CharacterCard = {
  ...canonicalAladdinPrinceAli,
  id: "iTM",
  reprints: ["set1-069", "set9-092"],
  set: "009",
  cardNumber: 92,
  rarity: "common",
  externalIds: {
    lorcast: "crd_24ef95291e2f4379983568b7c01974ff",
    tcgPlayer: 650031,
  },
};
