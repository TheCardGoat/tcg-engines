import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyJungleGuideP3EnchantedI18n } from "./p3-054-woody-jungle-guide-enchanted.i18n";
import { woodyJungleGuide } from "./015-woody-jungle-guide";

export const woodyJungleGuideP3Enchanted: CharacterCard = {
  ...woodyJungleGuide,
  id: "aEL",
  set: "P03",
  cardNumber: 54,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: woodyJungleGuideP3EnchantedI18n,
};
