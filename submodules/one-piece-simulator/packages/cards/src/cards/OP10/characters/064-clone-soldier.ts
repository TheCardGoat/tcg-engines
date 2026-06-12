import type { CharacterCard } from "@tcg/op-types";
import { op10CloneSoldier064I18n } from "./064-clone-soldier.i18n.ts";

export const op10CloneSoldier064: CharacterCard = {
  id: "OP10-064",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op10CloneSoldier064I18n,
};
