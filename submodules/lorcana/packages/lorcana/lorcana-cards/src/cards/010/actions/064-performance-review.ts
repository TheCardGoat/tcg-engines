import type { ActionCard } from "@tcg/lorcana-types";
import { performanceReviewI18n } from "./064-performance-review.i18n";

export const performanceReview: ActionCard = {
  id: "Alh",
  canonicalId: "ci_Alh",
  reprints: ["set10-064"],
  cardType: "action",
  name: "Performance Review",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 64,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_222374c54b4848939d442c144758404e",
    tcgPlayer: 660367,
  },
  text: "{E} chosen ready character of yours to draw cards equal to that character's {L}.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "ready",
                },
              ],
            },
          },
          {
            type: "draw",
            target: "CONTROLLER",
            amount: {
              type: "target-attribute",
              attribute: "lore",
            },
          },
        ],
      },
    },
  ],
  i18n: performanceReviewI18n,
};
