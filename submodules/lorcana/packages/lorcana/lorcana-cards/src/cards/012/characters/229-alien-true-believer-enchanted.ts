import type { CharacterCard } from "@tcg/lorcana-types";
import { alienTrueBelieverEnchantedI18n } from "./229-alien-true-believer-enchanted.i18n";
import { alienTrueBeliever } from "./083-alien-true-believer";

export const alienTrueBelieverEnchanted: CharacterCard = {
  ...alienTrueBeliever,
  id: "EVP",
  cardNumber: 229,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: alienTrueBelieverEnchantedI18n,
};
