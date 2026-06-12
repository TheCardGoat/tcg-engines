import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalCaringCultivatorEnchantedI18n } from "./224-isabela-madrigal-caring-cultivator-enchanted.i18n";
import { isabelaMadrigalCaringCultivator } from "./019-isabela-madrigal-caring-cultivator";

export const isabelaMadrigalCaringCultivatorEnchanted: CharacterCard = {
  ...isabelaMadrigalCaringCultivator,
  id: "fzU",
  cardNumber: 224,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: isabelaMadrigalCaringCultivatorEnchantedI18n,
};
