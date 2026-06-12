import type { ActionCard } from "@tcg/lorcana-types";
import { teethAndAmbitionsI18n } from "./130-teeth-and-ambitions.i18n";

export const teethAndAmbitions: ActionCard = {
  id: "4lC",
  canonicalId: "ci_4lC",
  reprints: ["set2-130"],
  cardType: "action",
  name: "Teeth and Ambitions",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  cardNumber: 130,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5fede8ed6d6845b7be83496ccb0fb2f8",
    tcgPlayer: 527248,
  },
  text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 2,
            type: "deal-damage",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 2,
              type: "deal-damage",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                requireDifferentTargets: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: teethAndAmbitionsI18n,
};
