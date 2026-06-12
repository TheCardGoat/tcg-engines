import type { CharacterCard } from "@tcg/op-types";
import { eb01Hamlet024I18n } from "./024-hamlet.i18n.ts";

export const eb01Hamlet024: CharacterCard = {
  id: "EB01-024",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  effect:
    "If you have 4 or less cards in your hand, all of your [SMILE] type Characters gain +1000 power.",
  i18n: eb01Hamlet024I18n,
};
