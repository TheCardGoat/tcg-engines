import type { ActionCard } from "@tcg/lorcana-types";
import { touchTheSkyEnchantedI18n } from "./240-touch-the-sky-enchanted.i18n";
import { touchTheSky } from "./199-touch-the-sky";

export const touchTheSkyEnchanted: ActionCard = {
  ...touchTheSky,
  id: "fvk",
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: touchTheSkyEnchantedI18n,
};
