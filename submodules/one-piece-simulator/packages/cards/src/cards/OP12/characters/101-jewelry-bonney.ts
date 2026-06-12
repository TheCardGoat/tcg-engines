import type { CharacterCard } from "@tcg/op-types";
import { op12JewelryBonney101I18n } from "./101-jewelry-bonney.i18n.ts";

export const op12JewelryBonney101: CharacterCard = {
  id: "OP12-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character: Your "Supernovas" type Leader gains +1000 power until the end of your opponent\'s next turn.',
  i18n: op12JewelryBonney101I18n,
};
