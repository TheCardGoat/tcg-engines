import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalConfidentClimberEnchantedI18n } from "./227-luisa-madrigal-confident-climber-enchanted.i18n";
import { luisaMadrigalConfidentClimber } from "./060-luisa-madrigal-confident-climber";

export const luisaMadrigalConfidentClimberEnchanted: CharacterCard = {
  ...luisaMadrigalConfidentClimber,
  id: "tQG",
  cardNumber: 227,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: luisaMadrigalConfidentClimberEnchantedI18n,
};
