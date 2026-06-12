import type { CharacterCard } from "@tcg/op-types";
import { op11Briscola090I18n } from "./090-briscola.i18n.ts";

export const op11Briscola090: CharacterCard = {
  id: "OP11-090",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op11Briscola090I18n,
};
