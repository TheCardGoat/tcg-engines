import type { CharacterCard } from "@tcg/lorcana-types";
import { mirageSuperRecruiterEpicI18n } from "./208-mirage-super-recruiter-epic.i18n";
import { mirageSuperRecruiter } from "./053-mirage-super-recruiter";

export const mirageSuperRecruiterEpic: CharacterCard = {
  ...mirageSuperRecruiter,
  id: "OGh",
  cardNumber: 208,
  rarity: "common",
  specialRarity: "epic",
  i18n: mirageSuperRecruiterEpicI18n,
};
