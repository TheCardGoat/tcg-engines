import type { CharacterCard } from "@tcg/op-types";
import { op13Rakuyo055I18n } from "./055-rakuyo.i18n.ts";

export const op13Rakuyo055: CharacterCard = {
  id: "OP13-055",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[When Attacking] If you have 4 or less cards in your hand, all of your Characters with a type including "Whitebeard Pirates" gain +1000 power during this turn.',
  i18n: op13Rakuyo055I18n,
};
