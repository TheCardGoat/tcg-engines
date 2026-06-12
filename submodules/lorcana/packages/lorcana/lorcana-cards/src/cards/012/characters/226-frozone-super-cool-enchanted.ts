import type { CharacterCard } from "@tcg/lorcana-types";
import { frozoneSuperCoolEnchantedI18n } from "./226-frozone-super-cool-enchanted.i18n";
import { frozoneSuperCool } from "./059-frozone-super-cool";

export const frozoneSuperCoolEnchanted: CharacterCard = {
  ...frozoneSuperCool,
  id: "RDv",
  cardNumber: 226,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: frozoneSuperCoolEnchantedI18n,
};
