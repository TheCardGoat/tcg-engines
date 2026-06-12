import type { CharacterCard } from "@tcg/op-types";
import { op12Shanks007I18n } from "./007-shanks.i18n.ts";

export const op12Shanks007: CharacterCard = {
  id: "OP12-007",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  effect:
    '[On Play] Up to 1 of your Characters with a type including "Roger Pirates" other than [Shanks] gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)',
  i18n: op12Shanks007I18n,
};
