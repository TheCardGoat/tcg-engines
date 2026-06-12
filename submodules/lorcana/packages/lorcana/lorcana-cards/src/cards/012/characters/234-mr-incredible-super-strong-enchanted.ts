import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleSuperStrongEnchantedI18n } from "./234-mr-incredible-super-strong-enchanted.i18n";
import { mrIncredibleSuperStrong } from "./127-mr-incredible-super-strong";

export const mrIncredibleSuperStrongEnchanted: CharacterCard = {
  ...mrIncredibleSuperStrong,
  id: "JV5",
  cardNumber: 234,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: mrIncredibleSuperStrongEnchantedI18n,
};
