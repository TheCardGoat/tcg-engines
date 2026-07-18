import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Kuroobi045I18n } from "./045-kuroobi.i18n.ts";

export const op14eb04Kuroobi045: CharacterCard = {
  id: "OP14-045",
  canonicalId: "OP14-045",
  slug: "kuroobi/op14-045",
  name: "Kuroobi",
  printings: [
    {
      id: "OP14-045",
      artId: "OP14-045",
      setCode: "OP14EB04",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-045_xmKCcQ7.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Fish-Man", "The Sun Pirates"],
  attribute: "strike",
  effect:
    "When a card is trashed from your hand by an effect, this Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenCardTrashedFromHandByEffect",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Kuroobi045I18n,
};
