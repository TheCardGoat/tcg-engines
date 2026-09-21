import type { CharacterCard } from "@tcg/op-types";
import { op04CaponeGangBege100I18n } from "./op04-100-capone-gang-bege.i18n.ts";

export const op04CaponeGangBege100: CharacterCard = {
  id: "OP04-100",
  canonicalId: "OP04-100",
  slug: "capone-gang-bege/op04-100",
  name: 'Capone"Gang"Bege',
  printings: [
    {
      id: "OP04-100",
      artId: "OP04-100",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100.jpg",
    },
    {
      id: "OP04-100_p1",
      artId: "OP04-100_p1",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p1.jpg",
    },
    {
      id: "OP04-100_p3",
      artId: "OP04-100_p3",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p3.jpg",
      label: 'Capone"Gang"Bege (OP04-100) (Jolly Roger Foil)',
    },
    {
      id: "OP04-100_p4",
      artId: "OP04-100_p4",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p4.jpg",
      label: 'Capone"Gang"Bege (OP04-100) (Full Art)',
    },
    {
      id: "OP04-100_p5",
      artId: "OP04-100_p5",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_p5.jpg",
      label: 'Capone"Gang"Bege (OP04-100) (Alternate Art)',
    },
    {
      id: "OP04-100_r1",
      artId: "OP04-100_r1",
      setCode: "OP04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-100_r1.jpg",
    },
  ],
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

  effect:
    "[Trigger] Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04CaponeGangBege100I18n,
};
