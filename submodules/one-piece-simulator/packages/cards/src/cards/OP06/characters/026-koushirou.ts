import type { CharacterCard } from "@tcg/op-types";
import { op06Koushirou026I18n } from "./026-koushirou.i18n.ts";

export const op06Koushirou026: CharacterCard = {
  id: "OP06-026",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Frost Moon Village"],
  attribute: "slash",
  effect:
    '[On Play] Set up to 1 of your "Slash" attribute Characters with a cost of 4 or less as active. Then, you cannot attack a Leader during this turn.',
  i18n: op06Koushirou026I18n,
};
