import type { ActionCard } from "@tcg/lorcana-types";
import { whenYouNeedHelpJustCallI18n } from "./032-when-you-need-help-just-call.i18n";

export const whenYouNeedHelpJustCall: ActionCard = {
  id: "tjB",
  canonicalId: "ci_tjB",
  reprints: ["set12-032"],
  cardType: "action",
  name: "When You Need Help, Just Call",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 32,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_b12d63a99baa4fa1b94f257cb6530acc",
  },
  text: "If an opponent has more characters in play than you, you may play a character with cost 4 or less for free.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      condition: {
        type: "comparison",
        left: {
          type: "character-count",
          controller: "opponent",
        },
        comparison: "greater-than",
        right: {
          type: "character-count",
          controller: "you",
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          cost: "free",
          from: "hand",
          type: "play-card",
          filter: {
            maxCost: 4,
          },
        },
      },
    },
  ],
  i18n: whenYouNeedHelpJustCallI18n,
};
