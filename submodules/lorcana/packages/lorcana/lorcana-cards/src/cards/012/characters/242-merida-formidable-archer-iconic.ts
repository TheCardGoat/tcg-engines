import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaFormidableArcherIconicI18n } from "./242-merida-formidable-archer-iconic.i18n";
import { meridaFormidableArcher } from "./191-merida-formidable-archer";

export const meridaFormidableArcherIconic: CharacterCard = {
  ...meridaFormidableArcher,
  id: "35B",
  cardNumber: 242,
  rarity: "common",
  specialRarity: "iconic",
  i18n: meridaFormidableArcherIconicI18n,
};
