import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiEtherealGuide } from "./052-rafiki-ethereal-guide";

export const rafikiEtherealGuideEnchanted: CharacterCard = {
  ...rafikiEtherealGuide,
  id: "mMK",
  reprints: ["set6-052"],
  set: "006",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_d5432572fd3d4dfc95b01b682c71943c",
    tcgPlayer: 592032,
  },
};
