import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookMasterSwordsman } from "./105-captain-hook-master-swordsman";

export const captainHookMasterSwordsmanEnchanted: CharacterCard = {
  ...captainHookMasterSwordsman,
  id: "mkt",
  reprints: ["set3-105"],
  set: "003",
  cardNumber: 214,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_266d7d17b42a44be9472057e4e6dd1b1",
    tcgPlayer: 539166,
  },
};
