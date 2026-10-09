import type { LeaderCard } from "@tcg/op-types";
import { st02EustassCaptainKid001I18n } from "./st02-001-eustass-captain-kid.i18n.ts";
export const st02EustassCaptainKid001: LeaderCard = {
  id: "ST02-001",
  canonicalId: "ST02-001",
  slug: "eustass-captain-kid/st02-001",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "ST02-001",
      artId: "ST02-001",
      setCode: "ST02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-001.png",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "ST02",
  life: 5,
  power: 5000,
  traits: ["Supernovas", "Kid Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn]  ③ (You may rest the specified number of DON!! cards in your cost area.) You may trash 1 card from your hand: Set this Leader as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st02EustassCaptainKid001I18n,
};
