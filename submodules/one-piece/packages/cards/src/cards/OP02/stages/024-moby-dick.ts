import type { StageCard } from "@tcg/op-types";
import { op02MobyDick024I18n } from "./024-moby-dick.i18n.ts";

export const op02MobyDick024: StageCard = {
  id: "OP02-024",
  canonicalId: "OP02-024",
  slug: "moby-dick/op02-024",
  name: "Moby Dick",
  printings: [
    {
      id: "OP02-024",
      artId: "OP02-024",
      setCode: "OP02",
      collectorNumber: "024",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-024.jpg",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Your Turn] If you have 1 or less Life cards, your [Edward.Newgate] and all your Characters with a type including "Whitebeard Pirates" gain +2000 power. [Trigger] Play this card.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op02MobyDick024I18n,
};
