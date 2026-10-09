import type { LeaderCard } from "@tcg/op-types";
import { st13MonkeyDLuffy003I18n } from "./st13-003-monkey-d-luffy.i18n.ts";
export const st13MonkeyDLuffy003: LeaderCard = {
  id: "ST13-003",
  canonicalId: "ST13-003",
  slug: "monkey-d-luffy/st13-003",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST13-003",
      artId: "ST13-003",
      setCode: "ST13",
      collectorNumber: "003",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-003.png",
    },
  ],
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "ST13",
  traits: ["Supernovas", "Straw Hat Crew"],
  life: 4,
  power: 5000,
  attribute: "strike",
  effect:
    "Your face-up Life cards are placed at the bottom of your deck instead of being added to your hand, according to the rules. [DON!! x2] [Activate: Main] [Once Per Turn] You may trash 1 card from your hand: If you have 0 Life cards, add up to 2 Character cards with a cost of 5 from your hand or trash to the top of your Life cards face-up.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "lifeToHandReplacement",
            player: "self",
            faceUp: true,
            destination: "deck",
            position: "bottom",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        postCostConditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "eq",
            value: 0,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand", "trash"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 5,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: st13MonkeyDLuffy003I18n,
};
