import type { ActionCard } from "@tcg/lorcana-types";
import { freezeI18n } from "./063-freeze.i18n";

export const freeze: ActionCard = {
  id: "D1e",
  canonicalId: "ci_D1e",
  reprints: ["set1-063"],
  cardType: "action",
  name: "Freeze",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 63,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_7ea36567dec64789a714995b1f459a47",
    tcgPlayer: 508733,
  },
  text: "Exert chosen opposing character.",
  abilities: [
    {
      type: "action",
      effect: {
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "exert",
      },
    },
  ],
  i18n: freezeI18n,
};
