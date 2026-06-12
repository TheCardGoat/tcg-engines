import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasSteadfastTravelerEpicI18n } from "./220-pocahontas-steadfast-traveler-epic.i18n";
import { pocahontasSteadfastTraveler } from "./171-pocahontas-steadfast-traveler";

export const pocahontasSteadfastTravelerEpic: CharacterCard = {
  ...pocahontasSteadfastTraveler,
  id: "WiQ",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  i18n: pocahontasSteadfastTravelerEpicI18n,
};
