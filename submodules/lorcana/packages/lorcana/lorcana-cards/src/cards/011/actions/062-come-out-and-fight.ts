import type { ActionCard } from "@tcg/lorcana-types";
import { comeOutAndFightI18n } from "./062-come-out-and-fight.i18n";

export const comeOutAndFight: ActionCard = {
  id: "H72",
  canonicalId: "ci_H72",
  reprints: ["set11-062"],
  cardType: "action",
  name: "Come Out and Fight!",
  inkType: ["amethyst"],
  set: "011",
  cardNumber: 62,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9d9eb44aa6324c2ebce958cbf92a2d31",
    tcgPlayer: 675298,
  },
  text: "Put all cards from under chosen character, item, or location on the bottom of their player's deck in a random order. Draw a card.",
  abilities: [
    {
      id: "qk5-1",
      type: "action",
      text: "Put all cards from under chosen character, item, or location on the bottom of their player's deck in a random order. Draw a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-cards-from-under",
            destination: "deck-bottom-random",
            target: "CHOSEN_CHARACTER_ITEM_OR_LOCATION",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: comeOutAndFightI18n,
};
