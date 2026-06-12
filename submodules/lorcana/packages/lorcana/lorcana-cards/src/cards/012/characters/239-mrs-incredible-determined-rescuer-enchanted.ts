import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleDeterminedRescuerEnchantedI18n } from "./239-mrs-incredible-determined-rescuer-enchanted.i18n";
import { mrsIncredibleDeterminedRescuer } from "./195-mrs-incredible-determined-rescuer";

export const mrsIncredibleDeterminedRescuerEnchanted: CharacterCard = {
  ...mrsIncredibleDeterminedRescuer,
  id: "RJJ",
  cardNumber: 239,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: mrsIncredibleDeterminedRescuerEnchantedI18n,
};
