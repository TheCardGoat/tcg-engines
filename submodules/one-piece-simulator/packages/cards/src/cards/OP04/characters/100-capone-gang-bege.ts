import type { CharacterCard } from "@tcg/op-types";
import { op04CaponeGangBege100I18n } from "./100-capone-gang-bege.i18n.ts";

export const op04CaponeGangBege100: CharacterCard = {
  id: "OP04-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 2000,
  trigger: "Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.",
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p1.jpg",
      imageId: "OP04-100_p1",
    },
  ],
  effect:
    "[Trigger] Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.",
  i18n: op04CaponeGangBege100I18n,
};
