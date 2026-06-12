import type { CharacterCard } from "@tcg/op-types";
import { op09NicoRobin033I18n } from "./033-nico-robin.i18n.ts";

export const op09NicoRobin033: CharacterCard = {
  id: "OP09-033",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "strike",
  effect:
    '[On Play] If you have 2 or more rested Characters, none of your "ODYSSEY" or "Straw Hat Crew" type Characters can be K.O.\'d by effects until the end of your opponent\'s next turn.',
  i18n: op09NicoRobin033I18n,
};
