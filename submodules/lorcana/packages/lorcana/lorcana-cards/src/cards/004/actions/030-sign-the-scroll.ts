import type { ActionCard } from "@tcg/lorcana-types";
import { signTheScrollI18n } from "./030-sign-the-scroll.i18n";

export const signTheScroll: ActionCard = {
  id: "zkw",
  canonicalId: "ci_zkw",
  reprints: ["set4-030"],
  cardType: "action",
  name: "Sign the Scroll",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 30,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_9f0c12874b204c0f99d48aa7ddb68c51",
    tcgPlayer: 547681,
  },
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
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
              amount: 2,
              target: "CONTROLLER",
              type: "gain-lore",
            },
          },
        ],
        type: "sequence",
      },
      id: "ggh-1",
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
      type: "action",
    },
  ],
  i18n: signTheScrollI18n,
};
