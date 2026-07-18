import type { CharacterCard } from "@tcg/op-types";
import { prb02RoronoaZoroPrb02006006I18n } from "./006-roronoa-zoro-prb02-006.i18n.ts";

export const prb02RoronoaZoroPrb02006006: CharacterCard = {
  id: "PRB02-006",
  canonicalId: "PRB02-006",
  slug: "roronoa-zoro-prb02-006",
  name: "Roronoa Zoro - PRB02-006",
  printings: [
    {
      id: "PRB02-006",
      artId: "PRB02-006",
      setCode: "PRB02",
      collectorNumber: "006",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-006.jpg",
    },
    {
      id: "PRB02-006_p1",
      artId: "PRB02-006_p1",
      setCode: "PRB02",
      collectorNumber: "006",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-006_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-006_p1.jpg",
      imageId: "PRB02-006_p1",
    },
  ],
  effect:
    "[Opponent's Turn] If this Character would be rested by your opponent's Character's effect, you may rest 1 of your other Characters instead.[Blocker]",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "rested",
        source: "opponentCharacterEffect",
        eventFilter: { targetSelf: true },
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            filters: [{ filter: "excludeSelf" }],
          },
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: prb02RoronoaZoroPrb02006006I18n,
};
