import type { CharacterCard } from "@tcg/lorcana-types";
import { theLeviathanGuardianOfAtlantisEnchantedI18n } from "./233-the-leviathan-guardian-of-atlantis-enchanted.i18n";
import { theLeviathanGuardianOfAtlantis } from "./125-the-leviathan-guardian-of-atlantis";

export const theLeviathanGuardianOfAtlantisEnchanted: CharacterCard = {
  ...theLeviathanGuardianOfAtlantis,
  id: "ecd",
  cardNumber: 233,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: theLeviathanGuardianOfAtlantisEnchantedI18n,
};
