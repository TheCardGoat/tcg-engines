import type { CharacterCard, Effect } from "@tcg/lorcana-types";
import { simbaFightingPrinceI18n } from "./192-simba-fighting-prince.i18n";

const stepDownOrFightEffect: Effect = {
  chooser: "CONTROLLER",
  effect: {
    type: "choice",
    optionLabels: [
      "Draw 2 cards, then choose and discard 2 cards.",
      "Deal 2 damage to chosen character.",
    ],
    options: [
      {
        type: "sequence",
        steps: [
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 2,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
        ],
      },
      {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
    ],
  },
  type: "optional",
};

export const simbaFightingPrince: CharacterCard = {
  id: "7KP",
  canonicalId: "ci_7KP",
  reprints: ["set3-192"],
  cardType: "character",
  name: "Simba",
  version: "Fighting Prince",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 192,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_95033988f96048348b305ef2c6293ac6",
    tcgPlayer: 539115,
  },
  text: [
    {
      title: "STEP DOWN OR FIGHT",
      description:
        "When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    {
      id: "1sf-1",
      name: "STEP DOWN OR FIGHT",
      text: "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: stepDownOrFightEffect,
    },
    {
      id: "1sf-2",
      name: "STEP DOWN OR FIGHT",
      text: "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: stepDownOrFightEffect,
    },
  ],
  i18n: simbaFightingPrinceI18n,
};
