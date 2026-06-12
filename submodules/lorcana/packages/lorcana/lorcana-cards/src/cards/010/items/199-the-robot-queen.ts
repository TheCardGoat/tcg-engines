import type { ItemCard } from "@tcg/lorcana-types";
import { theRobotQueenI18n } from "./199-the-robot-queen.i18n";

export const theRobotQueen: ItemCard = {
  id: "Msu",
  canonicalId: "ci_Msu",
  reprints: ["set10-199"],
  cardType: "item",
  name: "The Robot Queen",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  cardNumber: 199,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_66f7d006b33147e3b08181ee9299e5d1",
    tcgPlayer: 658498,
  },
  text: [
    {
      title: "MAJOR MALFUNCTION",
      description:
        "Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  ref: "self",
                },
              },
              {
                amount: 2,
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
                type: "deal-damage",
              },
            ],
          },
        },
        type: "optional",
      },
      id: "n1t-1",
      name: "MAJOR MALFUNCTION",
      text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theRobotQueenI18n,
};
