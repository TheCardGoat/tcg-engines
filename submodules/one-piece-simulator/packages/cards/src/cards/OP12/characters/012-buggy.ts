import type { CharacterCard } from "@tcg/op-types";
import { op12Buggy012I18n } from "./012-buggy.i18n.ts";

export const op12Buggy012: CharacterCard = {
  id: "OP12-012",
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
    '[On Play] Up to 1 of your Characters with a type including "Roger Pirates" other than [Buggy] gains [Blocker] until the end of your opponent\'s next End Phase.',
  i18n: op12Buggy012I18n,
};
