import type { ActionCard } from "@tcg/lorcana-types";
import { unfortunateSituationI18n } from "./199-unfortunate-situation.i18n";

export const unfortunateSituation: ActionCard = {
  id: "z7M",
  canonicalId: "ci_z7M",
  reprints: ["set6-199"],
  cardType: "action",
  name: "Unfortunate Situation",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 199,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_178a79a0d95a433d9a6add9dccca0730",
    tcgPlayer: 587974,
  },
  text: "Each opponent chooses one of their characters and deals 4 damage to them.",
  abilities: [
    {
      effect: {
        type: "deal-damage",
        amount: 4,
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "dpk-1",
      text: "Each opponent chooses one of their characters and deals 4 damage to them.",
      type: "action",
    },
  ],
  i18n: unfortunateSituationI18n,
};
