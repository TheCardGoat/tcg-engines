import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckPirateCaptain } from "./081-daisy-duck-pirate-captain";

export const daisyDuckPirateCaptainEnchanted: CharacterCard = {
  ...daisyDuckPirateCaptain,
  id: "JjK",
  reprints: ["set6-081"],
  set: "006",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_21bfac43fba64c06ab62139f3befd6c1",
    tcgPlayer: 592040,
  },
};
