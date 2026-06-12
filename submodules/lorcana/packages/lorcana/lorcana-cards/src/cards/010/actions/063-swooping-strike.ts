import type { ActionCard } from "@tcg/lorcana-types";
import { swoopingStrikeI18n } from "./063-swooping-strike.i18n";

export const swoopingStrike: ActionCard = {
  id: "uRz",
  canonicalId: "ci_uRz",
  reprints: ["set10-063"],
  cardType: "action",
  name: "Swooping Strike",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 63,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c285a7ee2f8644b3a286c71d28dabaa6",
    tcgPlayer: 659417,
  },
  text: "Each opponent chooses and exerts one of their ready characters.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "exert",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "ready",
            },
          ],
        },
      },
    },
  ],
  i18n: swoopingStrikeI18n,
};
