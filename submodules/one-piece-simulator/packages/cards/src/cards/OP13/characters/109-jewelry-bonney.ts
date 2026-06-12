import type { CharacterCard } from "@tcg/op-types";
import { op13JewelryBonney109I18n } from "./109-jewelry-bonney.i18n.ts";

export const op13JewelryBonney109: CharacterCard = {
  id: "OP13-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "If this Character would be removed from the field by your opponent's effect, you may turn 1 card from the top of your Life cards face-up instead.",
  i18n: op13JewelryBonney109I18n,
};
