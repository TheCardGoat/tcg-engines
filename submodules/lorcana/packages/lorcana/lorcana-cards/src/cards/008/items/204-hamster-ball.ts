import type { ItemCard } from "@tcg/lorcana-types";
import { hamsterBallI18n } from "./204-hamster-ball.i18n";

export const hamsterBall: ItemCard = {
  id: "ohB",
  canonicalId: "ci_ohB",
  reprints: ["set8-204"],
  cardType: "item",
  name: "Hamster Ball",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 204,
  rarity: "common",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_38ec8cb24ad14a0cb16620ec01a89b88",
    tcgPlayer: 631485,
  },
  text: [
    {
      title: "ROLL WITH THE PUNCHES",
      description:
        "{E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "undamaged",
            },
          ],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "1s0-1",
      name: "ROLL WITH THE PUNCHES",
      text: "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: hamsterBallI18n,
};
