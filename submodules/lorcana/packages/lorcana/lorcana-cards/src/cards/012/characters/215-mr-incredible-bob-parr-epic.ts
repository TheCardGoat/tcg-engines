import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleBobParrEpicI18n } from "./215-mr-incredible-bob-parr-epic.i18n";
import { mrIncredibleBobParr } from "./104-mr-incredible-bob-parr";

export const mrIncredibleBobParrEpic: CharacterCard = {
  ...mrIncredibleBobParr,
  id: "3CQ",
  cardNumber: 215,
  rarity: "common",
  specialRarity: "epic",
  i18n: mrIncredibleBobParrEpicI18n,
};
