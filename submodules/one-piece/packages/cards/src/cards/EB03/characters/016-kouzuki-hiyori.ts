import type { CharacterCard } from "@tcg/op-types";
import { eb03KouzukiHiyori016I18n } from "./016-kouzuki-hiyori.i18n.ts";

export const eb03KouzukiHiyori016: CharacterCard = {
  id: "EB03-016",
  canonicalId: "EB03-016",
  slug: "kouzuki-hiyori/eb03-016",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "EB03-016",
      artId: "EB03-016",
      setCode: "EB03",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-016_lsNg1M1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  power: 0,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Kouzuki Oden], draw 1 card.\n[Activate: Main] You may trash this Character: Give up to 1 rested DON!! card to your {Land of Wano} type Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Kouzuki Oden",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03KouzukiHiyori016I18n,
};
