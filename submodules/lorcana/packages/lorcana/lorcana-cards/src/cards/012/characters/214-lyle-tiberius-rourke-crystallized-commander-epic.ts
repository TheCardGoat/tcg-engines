import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeCrystallizedCommanderEpicI18n } from "./214-lyle-tiberius-rourke-crystallized-commander-epic.i18n";
import { lyleTiberiusRourkeCrystallizedCommander } from "./103-lyle-tiberius-rourke-crystallized-commander";

export const lyleTiberiusRourkeCrystallizedCommanderEpic: CharacterCard = {
  ...lyleTiberiusRourkeCrystallizedCommander,
  id: "Uz4",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  i18n: lyleTiberiusRourkeCrystallizedCommanderEpicI18n,
};
