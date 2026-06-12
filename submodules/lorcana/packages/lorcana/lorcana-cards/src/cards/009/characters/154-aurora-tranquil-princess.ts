import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraTranquilPrincess as canonicalAuroraTranquilPrincess } from "../../004";

export const auroraTranquilPrincess: CharacterCard = {
  ...canonicalAuroraTranquilPrincess,
  id: "aHj",
  reprints: ["set4-141", "set9-154"],
  set: "009",
  cardNumber: 154,
  rarity: "common",
  externalIds: {
    lorcast: "crd_84ca414b157a462fa322e66c8fe9cebc",
    tcgPlayer: 650089,
  },
};
