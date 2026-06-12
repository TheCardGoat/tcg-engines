import type { ActionCard } from "@tcg/lorcana-types";
import { tritonsDecreeI18n } from "./199-tritons-decree.i18n";

export const tritonsDecree: ActionCard = {
  id: "DrR",
  canonicalId: "ci_DrR",
  reprints: ["set4-199"],
  cardType: "action",
  name: "Triton's Decree",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 199,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_b54632a900e042c39771ae748820bf43",
    tcgPlayer: 550625,
  },
  text: "Each opponent chooses one of their characters and deals 2 damage to them.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: tritonsDecreeI18n,
};
