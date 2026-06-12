import type { CharacterCard } from "@tcg/op-types";
import { op01Pacifista075I18n } from "./075-pacifista.i18n.ts";

export const op01Pacifista075: CharacterCard = {
  id: "OP01-075",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 5000,
  traits: ["Biological Weapon Navy"],
  attribute: "special",
  effect:
    "Under the rules of this game, you may have any number of this card in your deck. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op01Pacifista075I18n,
};
