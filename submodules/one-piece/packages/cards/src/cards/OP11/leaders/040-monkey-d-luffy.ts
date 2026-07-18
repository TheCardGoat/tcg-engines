import type { LeaderCard } from "@tcg/op-types";
import { op11MonkeyDLuffy040I18n } from "./040-monkey-d-luffy.i18n.ts";

export const op11MonkeyDLuffy040: LeaderCard = {
  id: "OP11-040",
  canonicalId: "OP11-040",
  slug: "monkey-d-luffy/op11-040",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP11-040",
      artId: "OP11-040",
      setCode: "OP11",
      collectorNumber: "040",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-040.jpg",
    },
    {
      id: "OP11-040_p1",
      artId: "OP11-040_p1",
      setCode: "OP11",
      collectorNumber: "040",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-040_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP11",
  power: 6000,
  life: 3,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-040_p1.jpg",
      imageId: "OP11-040_p1",
    },
  ],
  effect:
    'This effect can be activated at the start of your turn. If you have 8 or more DON!! cards on your field, look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.',
  effects: {
    effects: [
      {
        trigger: "startOfYourTurn",
        conditions: [{ condition: "turn", value: "your" }],
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            revealDestination: "hand",
            remainderPosition: "any",
            condition: {
              condition: "donFieldCount",
              player: "self",
              comparison: "gte",
              value: 8,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11MonkeyDLuffy040I18n,
};
