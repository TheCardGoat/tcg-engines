import type { CharacterCard } from "@tcg/op-types";
import { op04Mr13MsFriday073I18n } from "./073-mr-13-ms-friday.i18n.ts";

export const op04Mr13MsFriday073: CharacterCard = {
  id: "OP04-073",
  canonicalId: "OP04-073",
  slug: "mr-13-ms-friday",
  name: "Mr.13 & Ms.Friday",
  printings: [
    {
      id: "OP04-073",
      artId: "OP04-073",
      setCode: "OP04",
      collectorNumber: "073",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-073.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 1000,
  counter: 2000,
  traits: ["Animal", "Baroque Works"],
  attribute: "wisdom",
  effect:
    '[Activate:Main] You may trash this Character and 1 of your Characters with a type including "Baroque Works": Add up to 1 DON!! card from your DON!! deck and set it as active. [Trigger] Play this card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
          {
            cost: "trashCharacter",
            amount: 1,
            filters: [
              {
                filter: "excludeSelf",
              },
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op04Mr13MsFriday073I18n,
};
