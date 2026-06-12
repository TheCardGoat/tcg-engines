import type { CharacterCard } from "@tcg/lorcana-types";
import { jessieLivelyCowgirlEnchantedI18n } from "./223-jessie-lively-cowgirl-enchanted.i18n";
import { jessieLivelyCowgirl } from "./020-jessie-lively-cowgirl";

export const jessieLivelyCowgirlEnchanted: CharacterCard = {
  ...jessieLivelyCowgirl,
  id: "SkC",
  cardNumber: 223,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: jessieLivelyCowgirlEnchantedI18n,
};
