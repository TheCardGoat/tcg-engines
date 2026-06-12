import type { CharacterCard } from "@tcg/op-types";
import { op09NicoRobin071I18n } from "./071-nico-robin.i18n.ts";

export const op09NicoRobin071: CharacterCard = {
  id: "OP09-071",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09NicoRobin071I18n,
};
