import type { CharacterCard } from "@tcg/lorcana-types";
import { jackjackParrIncrediblePotentialEnchantedI18n } from "./232-jack-jack-parr-incredible-potential-enchanted.i18n";
import { jackjackParrIncrediblePotential } from "./121-jack-jack-parr-incredible-potential";

export const jackjackParrIncrediblePotentialEnchanted: CharacterCard = {
  ...jackjackParrIncrediblePotential,
  id: "JZG",
  cardNumber: 232,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: jackjackParrIncrediblePotentialEnchantedI18n,
};
