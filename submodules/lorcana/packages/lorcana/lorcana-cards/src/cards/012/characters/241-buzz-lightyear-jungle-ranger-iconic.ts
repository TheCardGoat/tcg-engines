import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearJungleRangerIconicI18n } from "./241-buzz-lightyear-jungle-ranger-iconic.i18n";
import { buzzLightyearJungleRanger } from "./091-buzz-lightyear-jungle-ranger";

export const buzzLightyearJungleRangerIconic: CharacterCard = {
  ...buzzLightyearJungleRanger,
  id: "wbm",
  cardNumber: 241,
  rarity: "common",
  specialRarity: "iconic",
  i18n: buzzLightyearJungleRangerIconicI18n,
};
