import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy073I18n } from "./073-monkey-d-luffy.i18n.ts";

export const op07MonkeyDLuffy073: CharacterCard = {
  id: "OP07-073",
  canonicalId: "OP07-073",
  slug: "monkey-d-luffy/op07-073",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP07-073",
      artId: "OP07-073",
      setCode: "OP07",
      collectorNumber: "073",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-073.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP07",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main][Once Per Turn] DON!! -3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your opponent has 3 or more Characters, set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            condition: {
              condition: "zoneCount",
              player: "opponent",
              zone: "character",
              comparison: "gte",
              value: 3,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07MonkeyDLuffy073I18n,
};
