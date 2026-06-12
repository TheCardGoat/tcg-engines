import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaCrystalScionEnchantedI18n } from "./236-kida-crystal-scion-enchanted.i18n";
import { kidaCrystalScion } from "./160-kida-crystal-scion";

export const kidaCrystalScionEnchanted: CharacterCard = {
  ...kidaCrystalScion,
  id: "r6R",
  cardNumber: 236,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: kidaCrystalScionEnchantedI18n,
};
