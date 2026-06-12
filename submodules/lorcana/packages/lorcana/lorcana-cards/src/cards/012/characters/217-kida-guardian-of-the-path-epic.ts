import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaGuardianOfThePathEpicI18n } from "./217-kida-guardian-of-the-path-epic.i18n";
import { kidaGuardianOfThePath } from "./144-kida-guardian-of-the-path";

export const kidaGuardianOfThePathEpic: CharacterCard = {
  ...kidaGuardianOfThePath,
  id: "vjJ",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  i18n: kidaGuardianOfThePathEpicI18n,
};
