import type { CharacterCard } from "@tcg/op-types";
import { op02Shiki075I18n } from "./075-shiki.i18n.ts";

export const op02Shiki075: CharacterCard = {
  id: "OP02-075",
  canonicalId: "OP02-075",
  slug: "shiki/op02-075",
  name: "Shiki",
  printings: [
    {
      id: "OP02-075",
      artId: "OP02-075",
      setCode: "OP02",
      collectorNumber: "075",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-075.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 2000,
  trigger:
    "DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  traits: ["FILM Golden Lion Pirates"],
  attribute: "slash",
  effect:
    "[Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  i18n: op02Shiki075I18n,
};
