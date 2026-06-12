import type { ActionCard } from "@tcg/lorcana-types";
import { blastFromYourPastI18n } from "./028-blast-from-your-past.i18n";

export const blastFromYourPast: ActionCard = {
  id: "hV2",
  canonicalId: "ci_hV2",
  reprints: ["set5-028"],
  cardType: "action",
  name: "Blast from Your Past",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 28,
  rarity: "common",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_1fafea8238334475ae8ed9ece3728309",
    tcgPlayer: 561468,
  },
  text: "Name a card. Return all character cards with that name from your discard to your hand.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "name-a-card",
          },
          {
            type: "return-to-hand",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["discard"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "named-card",
                },
              ],
            },
          },
        ],
      },
      id: "1tj-1",
      text: "Name a card. Return all character cards with that name from your discard to your hand.",
      type: "action",
    },
  ],
  i18n: blastFromYourPastI18n,
};
