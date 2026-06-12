import type { CharacterCard } from "@tcg/lorcana-types";
import { rexProtectiveDinosaurEpicI18n } from "./206-rex-protective-dinosaur-epic.i18n";
import { rexProtectiveDinosaur } from "./010-rex-protective-dinosaur";

export const rexProtectiveDinosaurEpic: CharacterCard = {
  ...rexProtectiveDinosaur,
  id: "kOA",
  cardNumber: 206,
  rarity: "common",
  specialRarity: "epic",
  i18n: rexProtectiveDinosaurEpicI18n,
};
