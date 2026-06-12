import type { ActionCard } from "@tcg/lorcana-types";
import { theFamilyScatteredEnchantedI18n } from "./231-the-family-scattered-enchanted.i18n";
import { theFamilyScattered } from "./097-the-family-scattered";

export const theFamilyScatteredEnchanted: ActionCard = {
  ...theFamilyScattered,
  id: "SaO",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: theFamilyScatteredEnchantedI18n,
};
