import type { CharacterCard } from "@tcg/op-types";
import { op12MarshallDTeach054I18n } from "./054-marshall-d-teach.i18n.ts";

export const op12MarshallDTeach054: CharacterCard = {
  id: "OP12-054",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    '[On Play] If your Leader has the "The Seven Warlords of the Sea" type, return up to 1 Character with a cost of 1 or less other than this Character to the owner\'s hand.',
  i18n: op12MarshallDTeach054I18n,
};
