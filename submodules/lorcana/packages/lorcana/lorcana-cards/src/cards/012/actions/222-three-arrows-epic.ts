import type { ActionCard } from "@tcg/lorcana-types";
import { threeArrowsEpicI18n } from "./222-three-arrows-epic.i18n";
import { threeArrows } from "./197-three-arrows";

export const threeArrowsEpic: ActionCard = {
  ...threeArrows,
  id: "t4e",
  cardNumber: 222,
  rarity: "common",
  specialRarity: "epic",
  i18n: threeArrowsEpicI18n,
};
