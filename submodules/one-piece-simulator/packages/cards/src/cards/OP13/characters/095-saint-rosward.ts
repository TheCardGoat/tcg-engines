import type { CharacterCard } from "@tcg/op-types";
import { op13SaintRosward095I18n } from "./095-saint-rosward.i18n.ts";

export const op13SaintRosward095: CharacterCard = {
  id: "OP13-095",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  effect:
    '[On Play] You may trash 1 card from your hand: If you only have "Celestial Dragons" type Characters, K.O. up to 2 of your opponent\'s Characters with a base cost of 3 or less.',
  i18n: op13SaintRosward095I18n,
};
