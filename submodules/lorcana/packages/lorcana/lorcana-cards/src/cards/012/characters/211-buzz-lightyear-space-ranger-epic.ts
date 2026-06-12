import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearSpaceRangerEpicI18n } from "./211-buzz-lightyear-space-ranger-epic.i18n";
import { buzzLightyearSpaceRanger } from "./076-buzz-lightyear-space-ranger";

export const buzzLightyearSpaceRangerEpic: CharacterCard = {
  ...buzzLightyearSpaceRanger,
  id: "43p",
  cardNumber: 211,
  rarity: "common",
  specialRarity: "epic",
  i18n: buzzLightyearSpaceRangerEpicI18n,
};
