import type { ItemCard } from "@tcg/lorcana-types";
import { dunbrochFamilyTapestryEnchantedI18n } from "./228-dunbroch-family-tapestry-enchanted.i18n";
import { dunbrochFamilyTapestry } from "./067-dunbroch-family-tapestry";

export const dunbrochFamilyTapestryEnchanted: ItemCard = {
  ...dunbrochFamilyTapestry,
  id: "A0I",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: dunbrochFamilyTapestryEnchantedI18n,
};
