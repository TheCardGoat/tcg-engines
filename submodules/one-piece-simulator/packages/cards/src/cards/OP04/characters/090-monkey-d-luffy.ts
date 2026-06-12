import type { CharacterCard } from "@tcg/op-types";
import { op04MonkeyDLuffy090I18n } from "./090-monkey-d-luffy.i18n.ts";

export const op04MonkeyDLuffy090: CharacterCard = {
  id: "OP04-090",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP04",
  cost: 7,
  power: 7000,
  traits: ["Straw Hat Crew Dressrosa"],
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
  },
  i18n: op04MonkeyDLuffy090I18n,
};
