import type { ActionCard } from "@tcg/lorcana-types";
import { firstAidI18n } from "./027-first-aid.i18n";

export const firstAid: ActionCard = {
  id: "qRf",
  canonicalId: "ci_qRf",
  reprints: ["set4-027"],
  cardType: "action",
  name: "First Aid",
  inkType: ["amber"],
  set: "004",
  cardNumber: 27,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_258d12e6617d4e648d73be028f191b40",
    tcgPlayer: 550563,
  },
  text: "Remove up to 1 damage from each of your characters.",
  abilities: [
    {
      id: "qRf-1",
      text: "Remove up to 1 damage from each of your characters.",
      name: "First Aid",
      effect: {
        amount: { type: "up-to", value: 1 },
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      type: "action",
    },
  ],
  i18n: firstAidI18n,
};
