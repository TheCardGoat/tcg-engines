import type { ActionCard } from "@tcg/lorcana-types";
import { lastditchEffortI18n } from "./062-last-ditch-effort.i18n";

export const lastditchEffort: ActionCard = {
  id: "vq2",
  canonicalId: "ci_04M",
  reprints: ["set3-062", "set9-062"],
  cardType: "action",
  name: "Last-Ditch Effort",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  cardNumber: 62,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_1b909f18bf5e43948a2f59d32a9dbaa7",
    tcgPlayer: 650006,
  },
  text: "Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
        ],
      },
    },
  ],
  i18n: lastditchEffortI18n,
};
