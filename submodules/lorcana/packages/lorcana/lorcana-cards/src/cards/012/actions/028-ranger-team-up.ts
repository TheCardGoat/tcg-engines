import type { ActionCard } from "@tcg/lorcana-types";
import { rangerTeamupI18n } from "./028-ranger-team-up.i18n";

export const rangerTeamup: ActionCard = {
  id: "8mb",
  canonicalId: "ci_8mb",
  reprints: ["set12-028"],
  cardType: "action",
  name: "Ranger Team-Up",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 28,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ebf33c2b155d45cbbbcf8ecb24ebea14",
  },
  text: "Chosen character gets +{S} equal to their {W} this turn.",
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +{S} equal to their {W} this turn.",
      effect: {
        type: "modify-stat",
        target: "CHOSEN_CHARACTER",
        stat: "strength",
        duration: "this-turn",
        modifier: {
          type: "willpower-of",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            cardTypes: ["character"],
            zones: ["play"],
          },
        },
      },
    },
  ],
  i18n: rangerTeamupI18n,
};
