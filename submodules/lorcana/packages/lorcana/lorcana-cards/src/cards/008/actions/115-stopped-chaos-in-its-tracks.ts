import type { ActionCard } from "@tcg/lorcana-types";
import { stoppedChaosInItsTracksI18n } from "./115-stopped-chaos-in-its-tracks.i18n";

export const stoppedChaosInItsTracks: ActionCard = {
  id: "1ft",
  canonicalId: "ci_1ft",
  reprints: ["set8-115"],
  cardType: "action",
  name: "Stopped Chaos in Its Tracks",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "008",
  cardNumber: 115,
  rarity: "uncommon",
  cost: 8,
  inkable: true,
  externalIds: {
    lorcast: "crd_655c8f27d9fa48ce9e7ff33c0bf4f6c8",
    tcgPlayer: 631424,
  },
  text: [
    {
      title: "Sing Together 8",
      description:
        "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
    },
    {
      title: "Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: {
            upTo: 2,
          },
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
        type: "return-to-hand",
      },
      id: "pmx-1",
      text: "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
      type: "action",
    },
  ],
  i18n: stoppedChaosInItsTracksI18n,
};
