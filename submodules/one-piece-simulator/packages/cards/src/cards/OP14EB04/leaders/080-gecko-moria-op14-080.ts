import type { LeaderCard } from "@tcg/op-types";
import { op14eb04GeckoMoriaOp14080080I18n } from "./080-gecko-moria-op14-080.i18n.ts";

export const op14eb04GeckoMoriaOp14080080: LeaderCard = {
  id: "OP14-080",
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 4,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-080_2oXrBR0.jpg",
      imageId: "OP14-080",
    },
  ],
  effect:
    "[Activate: Main] [Once Per Turn] You may K.O. 1 of your {Thriller Bark Pirates} type Characters: Your Leader and all of your Characters gain +1000 power during this turn. [When Attacking] You may trash 3 cards from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04GeckoMoriaOp14080080I18n,
};
