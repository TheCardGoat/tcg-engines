import type { CharacterCard } from "@tcg/op-types";
import { op09DocQ090I18n } from "./090-doc-q.i18n.ts";

export const op09DocQ090: CharacterCard = {
  id: "OP09-090",
  canonicalId: "OP09-090",
  slug: "doc-q",
  name: "Doc Q",
  printings: [
    {
      id: "OP09-090",
      artId: "OP09-090",
      setCode: "OP09",
      collectorNumber: "090",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-090.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Blackbeard Pirates" type, K.O. up to 1 of your opponent\'s Characters with a cost of 1 or less.[On K.O.] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
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
  i18n: op09DocQ090I18n,
};
