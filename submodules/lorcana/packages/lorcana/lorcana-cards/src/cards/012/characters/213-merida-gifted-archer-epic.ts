import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaGiftedArcherEpicI18n } from "./213-merida-gifted-archer-epic.i18n";
import { meridaGiftedArcher } from "./089-merida-gifted-archer";

export const meridaGiftedArcherEpic: CharacterCard = {
  ...meridaGiftedArcher,
  id: "g6Q",
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
  i18n: meridaGiftedArcherEpicI18n,
};
