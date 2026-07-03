import type { ActionCard } from "@tcg/lorcana-types";
import { dangerousPlanI18n } from "./133-dangerous-plan.i18n";

export const dangerousPlan: ActionCard = {
  id: "XzQ",
  canonicalId: "ci_XzQ",
  slug: "lorcana-ci_XzQ",
  printings: [
    {
      id: "set12-133",
      artId: "set12-133",
      setCode: "set12",
      collectorNumber: "133",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-133"],
  cardType: "action",
  name: "Dangerous Plan",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 133,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6627e7f006944e7a80d5e0ac3dfa3506",
    tcgPlayer: "692056",
  },
  text: "Draw 2 cards. Then, discard a card at random.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            random: true,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: dangerousPlanI18n,
};
