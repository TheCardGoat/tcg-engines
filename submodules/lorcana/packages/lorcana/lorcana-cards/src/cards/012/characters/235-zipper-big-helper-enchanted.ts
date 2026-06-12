import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperBigHelperEnchantedI18n } from "./235-zipper-big-helper-enchanted.i18n";
import { zipperBigHelper } from "./150-zipper-big-helper";

export const zipperBigHelperEnchanted: CharacterCard = {
  ...zipperBigHelper,
  id: "fse",
  cardNumber: 235,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: zipperBigHelperEnchantedI18n,
};
