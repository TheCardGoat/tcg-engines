import type { CharacterCard } from "@tcg/op-types";
import { prb02EustassCaptainKidReprint112I18n } from "./112-eustass-captain-kid-reprint.i18n.ts";

export const prb02EustassCaptainKidReprint112: CharacterCard = {
  id: "OP10-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 8,
  power: 9000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
  effect:
    '[On Play] You may rest this Character: Trash up to 1 card from the top of your opponent\'s Life cards.[End of Your Turn] If your opponent has 2 or less Life cards, draw 1 card and trash 1 card from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
        optional: true,
      },
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 2,
          },
        ],
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
    ],
  },
  i18n: prb02EustassCaptainKidReprint112I18n,
};
