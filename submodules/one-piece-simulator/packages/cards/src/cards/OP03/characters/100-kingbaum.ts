import type { CharacterCard } from "@tcg/op-types";
import { op03Kingbaum100I18n } from "./100-kingbaum.i18n.ts";

export const op03Kingbaum100: CharacterCard = {
  id: "OP03-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  trigger: "You may trash 1 card from the top or bottom of your Life cards: Play this card.",
  traits: ["Big Mom Pirates Homies"],
  attribute: "strike",
  effect:
    "[Trigger] You may trash 1 card from the top or bottom of your Life cards: Play this card.",
  i18n: op03Kingbaum100I18n,
};
