import type { ActionCard } from "@tcg/lorcana-types";
import { ursulasTrickeryI18n } from "./096-ursulas-trickery.i18n";

export const ursulasTrickery: ActionCard = {
  id: "zNr",
  canonicalId: "ci_zNr",
  reprints: ["set4-096"],
  cardType: "action",
  name: "Ursula’s Trickery",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 96,
  rarity: "uncommon",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ab7661f7212743ee9509dc6f2546baa6",
    tcgPlayer: 550586,
  },
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "optional",
            chooser: "OPPONENT",
            effect: {
              amount: 1,
              chosen: true,
              target: "OPPONENT",
              type: "discard",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            else: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
          },
        ],
        type: "sequence",
      },
      id: "1sb-1",
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
      type: "action",
    },
  ],
  i18n: ursulasTrickeryI18n,
};
