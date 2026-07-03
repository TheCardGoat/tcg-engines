import type { CharacterCard } from "@tcg/op-types";
import { prb01MarcoJollyRogerFoil018I18n } from "./018-marco-jolly-roger-foil.i18n.ts";

export const prb01MarcoJollyRogerFoil018: CharacterCard = {
  id: "OP02-018",
  canonicalId: "OP02-018",
  slug: "marco-jolly-roger-foil",
  name: "Marco (Jolly Roger Foil)",
  printings: [
    {
      id: "OP02-018",
      artId: "OP02-018",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p4.jpg",
    },
    {
      id: "OP02-018_r2",
      artId: "OP02-018_r2",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_r2.jpg",
    },
    {
      id: "OP02-018_p5",
      artId: "OP02-018_p5",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p5.jpg",
    },
    {
      id: "OP02-018_p6",
      artId: "OP02-018_p6",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p6.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_r2.jpg",
      imageId: "OP02-018_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p5.jpg",
      imageId: "OP02-018_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p6.jpg",
      imageId: "OP02-018_p6",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On K.O.] You may trash 1 card with a type including "Whitebeard Pirates" from your hand: If you have 2 or less Life cards, play this Character card from your trash rested.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01MarcoJollyRogerFoil018I18n,
};
