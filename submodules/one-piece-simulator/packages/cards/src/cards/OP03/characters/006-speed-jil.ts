import type { CharacterCard } from "@tcg/op-types";
import { op03SpeedJil006I18n } from "./006-speed-jil.i18n.ts";

export const op03SpeedJil006: CharacterCard = {
  id: "OP03-006",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op03SpeedJil006I18n,
};
