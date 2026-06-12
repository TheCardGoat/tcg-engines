import type { ActionCard } from "@tcg/lorcana-types";
import { whatElseCanIDoEnchantedI18n } from "./237-what-else-can-i-do-enchanted.i18n";
import { whatElseCanIDo } from "./163-what-else-can-i-do";

export const whatElseCanIDoEnchanted: ActionCard = {
  ...whatElseCanIDo,
  id: "fHl",
  cardNumber: 237,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: whatElseCanIDoEnchantedI18n,
};
