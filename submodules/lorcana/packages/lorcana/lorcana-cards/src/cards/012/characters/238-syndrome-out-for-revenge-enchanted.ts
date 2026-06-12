import type { CharacterCard } from "@tcg/lorcana-types";
import { syndromeOutForRevengeEnchantedI18n } from "./238-syndrome-out-for-revenge-enchanted.i18n";
import { syndromeOutForRevenge } from "./172-syndrome-out-for-revenge";

export const syndromeOutForRevengeEnchanted: CharacterCard = {
  ...syndromeOutForRevenge,
  id: "2rj",
  cardNumber: 238,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: syndromeOutForRevengeEnchantedI18n,
};
