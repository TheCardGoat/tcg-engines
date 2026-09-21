import type { CharacterCard } from "@tcg/op-types";
import { op16Yamato098I18n } from "./op16-098-yamato.i18n.ts";

export const op16Yamato098: CharacterCard = {
  id: "OP16-098",
  canonicalId: "OP16-098",
  slug: "yamato/op16-098",
  name: "Yamato",
  printings: [
    {
      id: "OP16-098",
      artId: "OP16-098",
      setCode: "OP16",
      collectorNumber: "098",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-098_9dRdXcD.jpg",
      label: "Yamato (098)",
    },
    {
      id: "OP16-098_p1",
      artId: "OP16-098_p1",
      setCode: "OP16",
      collectorNumber: "098",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-098_p1_MKyDUP9.jpg",
      label: "Yamato (098) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP16",
  cost: 6,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[On Play] Draw 1 card and trash 1 card from your hand.\n[Activate:Main] You may trash this Character: Play up to 1 black [Yamato] with a cost of 8 from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
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
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 8,
              },
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "name",
                value: "Yamato",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Yamato098I18n,
};
