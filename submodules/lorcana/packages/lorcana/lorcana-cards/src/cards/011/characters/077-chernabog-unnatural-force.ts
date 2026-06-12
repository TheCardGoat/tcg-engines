import type { CharacterCard } from "@tcg/lorcana-types";
import { chernabogUnnaturalForceI18n } from "./077-chernabog-unnatural-force.i18n";

export const chernabogUnnaturalForce: CharacterCard = {
  id: "OZJ",
  canonicalId: "ci_OZJ",
  reprints: ["set11-077"],
  cardType: "character",
  name: "Chernabog",
  version: "Unnatural Force",
  inkType: ["emerald"],
  franchise: "Fantasia",
  set: "011",
  cardNumber: 77,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_10d405a5074a498592c40bed3888538a",
    tcgPlayer: 676198,
  },
  text: [
    {
      title: "DARK DANCE",
      description:
        "When you play this character, you may shuffle chosen opposing character into their player's deck. If you do, that player may play a character from their discard for free.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "1yh-1",
      name: "DARK DANCE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "shuffle-into-deck",
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "opponent",
                selector: "chosen",
                zones: ["play"],
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "optional",
              chooser: "OPPONENT",
              effect: {
                type: "play-card",
                from: "discard",
                cardType: "character",
                cost: "free",
              },
            },
          },
        ],
      },
      text: "DARK DANCE When you play this character, you may shuffle chosen opposing character into their player’s deck. If you do, that player may play a character from their discard for free.",
    },
  ],
  i18n: chernabogUnnaturalForceI18n,
};
