import type { CharacterCard } from "@tcg/op-types";
import { op05NefeltariVivi086I18n } from "./086-nefeltari-vivi.i18n.ts";

export const op05NefeltariVivi086: CharacterCard = {
  id: "OP05-086",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "If you have 10 or more cards in your trash, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op05NefeltariVivi086I18n,
};
