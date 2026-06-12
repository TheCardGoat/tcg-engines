import type { ActionCard } from "@tcg/lorcana-types";
import { packTacticsI18n } from "./100-pack-tactics.i18n";

export const packTactics: ActionCard = {
  id: "GkR",
  canonicalId: "ci_GkR",
  reprints: ["set2-100"],
  cardType: "action",
  name: "Pack Tactics",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 100,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_3255845b67e447e9821ea5cee4848f57",
    tcgPlayer: 525311,
  },
  text: "Gain 1 lore for each damaged character opponents have in play.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "for-each",
        counter: {
          controller: "opponent",
          type: "damaged-characters",
        },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
      },
    },
  ],
  i18n: packTacticsI18n,
};
