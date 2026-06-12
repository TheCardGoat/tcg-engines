import type { ActionCard } from "@tcg/lorcana-types";
import { youreWelcomeI18n } from "./096-youre-welcome.i18n";

export const youreWelcome: ActionCard = {
  id: "roA",
  canonicalId: "ci_IPh",
  reprints: ["set5-096"],
  cardType: "action",
  name: "You're Welcome",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "005",
  cardNumber: 96,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_f799b47b4b894912a8d83942d0fa4d22",
    tcgPlayer: 561983,
  },
  text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      id: "1my-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character", "item", "location"],
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CARD_OWNER",
          },
        ],
      },
      type: "action",
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    },
  ],
  i18n: youreWelcomeI18n,
};
