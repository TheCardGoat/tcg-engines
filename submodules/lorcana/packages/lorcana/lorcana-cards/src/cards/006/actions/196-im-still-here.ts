import type { ActionCard } from "@tcg/lorcana-types";
import { imStillHereI18n } from "./196-im-still-here.i18n";

export const imStillHere: ActionCard = {
  id: "HdJ",
  canonicalId: "ci_HdJ",
  reprints: ["set6-196"],
  cardType: "action",
  name: "I'm Still Here",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 196,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_139b6ae1e1c04ea0aef5ef864e8ed14b",
    tcgPlayer: 588151,
  },
  text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            keyword: "Resist",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 2,
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "7tt-1",
      text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
      type: "action",
    },
  ],
  i18n: imStillHereI18n,
};
