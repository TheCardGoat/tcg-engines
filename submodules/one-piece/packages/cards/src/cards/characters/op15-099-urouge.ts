import type { CharacterCard } from "@tcg/op-types";
import { op15Urouge099I18n } from "./op15-099-urouge.i18n.ts";

export const op15Urouge099: CharacterCard = {
  id: "OP15-099",
  canonicalId: "OP15-099",
  slug: "urouge/op15-099",
  name: "Urouge",
  printings: [
    {
      id: "OP15-099",
      artId: "OP15-099",
      setCode: "OP15",
      collectorNumber: "099",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-099_4jiuI1B.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP15",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas Sky Island"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 {Supernovas} type card from your hand: This Character gains [Rush] during this turn.\n[Activate: Main] You may turn 1 card from the top of your Life cards face-down: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Supernovas",
                match: "includes",
              },
            ],
          },
        ],
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
        optional: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: false,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
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
  i18n: op15Urouge099I18n,
};
