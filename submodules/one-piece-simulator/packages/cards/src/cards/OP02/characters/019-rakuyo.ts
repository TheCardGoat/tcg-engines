import type { CharacterCard } from "@tcg/op-types";
import { op02Rakuyo019I18n } from "./019-rakuyo.i18n.ts";

export const op02Rakuyo019: CharacterCard = {
  id: "OP02-019",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[DON!! x1] [Your Turn] All of your Characters with a type including "Whitebeard Pirates" gain +1000 power.',
  i18n: op02Rakuyo019I18n,
};
