import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseMusketeerChampion } from "./017-minnie-mouse-musketeer-champion";

export const minnieMouseMusketeerChampionEnchanted: CharacterCard = {
  ...minnieMouseMusketeerChampion,
  id: "ixE",
  reprints: ["set4-017"],
  set: "004",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b20587f1945e42d59b750f9b69cc4a6b",
    tcgPlayer: 550537,
  },
};
