import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchGettingHisHandsDirtyEnchantedI18n } from "./230-milo-thatch-getting-his-hands-dirty-enchanted.i18n";
import { miloThatchGettingHisHandsDirty } from "./082-milo-thatch-getting-his-hands-dirty";

export const miloThatchGettingHisHandsDirtyEnchanted: CharacterCard = {
  ...miloThatchGettingHisHandsDirty,
  id: "YXD",
  cardNumber: 230,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: miloThatchGettingHisHandsDirtyEnchantedI18n,
};
