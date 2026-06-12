import type { CharacterCard } from "@tcg/op-types";
import { op04NefeltariVivi118I18n } from "./118-nefeltari-vivi.i18n.ts";

export const op04NefeltariVivi118: CharacterCard = {
  id: "OP04-118",
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP04",
  cost: 7,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-118_p1.jpg",
      imageId: "OP04-118_p1",
    },
  ],
  effect:
    "All of your red Characters with a cost of 3 or more other than this Character gain [Rush]. (This card can attack on the turn in which it is played.",
  i18n: op04NefeltariVivi118I18n,
};
