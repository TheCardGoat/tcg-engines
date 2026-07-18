import type { CharacterCard } from "@tcg/op-types";
import { op04MonkeyDLuffy090I18n } from "./090-monkey-d-luffy.i18n.ts";

export const op04MonkeyDLuffy090: CharacterCard = {
  id: "OP04-090",
  canonicalId: "OP04-090",
  slug: "monkey-d-luffy/op04-090",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP04-090",
      artId: "OP04-090",
      setCode: "OP04",
      collectorNumber: "090",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-090.jpg",
    },
    {
      id: "OP04-090_p1",
      artId: "OP04-090_p1",
      setCode: "OP04",
      collectorNumber: "090",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-090_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP04",
  cost: 7,
  power: 7000,
  traits: ["Dressrosa", "Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-090_p1.jpg",
      imageId: "OP04-090_p1",
    },
  ],
  effect:
    "This Character can also attack active Characters. [Activate:Main] [Once Per Turn] You may return 7 cards from your trash to the bottom of your deck in any order: Set this Character as active. Then, this Character will not become active in your next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 7,
            position: "bottom",
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
          },
          {
            action: "freeze",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04MonkeyDLuffy090I18n,
};
