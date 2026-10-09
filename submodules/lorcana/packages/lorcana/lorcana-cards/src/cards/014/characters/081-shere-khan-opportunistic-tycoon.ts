import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanOpportunisticTycoonI18n } from "./081-shere-khan-opportunistic-tycoon.i18n";

export const shereKhanOpportunisticTycoon: CharacterCard = {
  id: "WJo",
  canonicalId: "ci_WJo",
  slug: "lorcana-ci_WJo",
  printings: [
    {
      id: "set14-081",
      artId: "set14-081",
      setCode: "set14",
      collectorNumber: "81",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-081"],
  cardType: "character",
  name: "Shere Khan",
  version: "Opportunistic Tycoon",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_365b2a72c6484d8e8bc2337b8f5b8d80",
  },
  text: [
    {
      title: "ONE-SIDED DEAL",
      description:
        "When you play this character, each opponent may choose and discard a card. For each opponent who doesn't, get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "WJo-1",
      name: "ONE-SIDED DEAL",
      type: "triggered",
      text: "ONE-SIDED DEAL When you play this character, each opponent may choose and discard a card. For each opponent who doesn't, get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              chooser: "OPPONENT",
              effect: {
                type: "discard",
                amount: 1,
                chosen: true,
                from: "hand",
                target: "OPPONENT",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "not",
                condition: {
                  type: "if-you-do",
                },
              },
              then: {
                type: "gain-ink-drop",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: shereKhanOpportunisticTycoonI18n,
};
