import type { CharacterCard } from "@tcg/lorcana-types";
import { sleepyDeepSleeperI18n } from "./044-sleepy-deep-sleeper.i18n";

export const sleepyDeepSleeper: CharacterCard = {
  id: "1Iw",
  canonicalId: "ci_1Iw",
  reprints: ["set12-044"],
  cardType: "character",
  name: "Sleepy",
  version: "Deep Sleeper",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 44,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_74d958eba8d84933bb8d416153a757d0",
  },
  text: [
    {
      title: "PLEASANT DREAMS",
      description:
        "When this character is banished, if you have a Seven Dwarfs or Princess character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      id: "1Iw-1",
      name: "PLEASANT DREAMS",
      type: "triggered",
      text: "PLEASANT DREAMS When this character is banished, if you have a Seven Dwarfs or Princess character in play, you may draw a card.",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "or",
        conditions: [
          {
            type: "has-character-with-classification",
            controller: "you",
            classification: "Seven Dwarfs",
          },
          {
            type: "has-character-with-classification",
            controller: "you",
            classification: "Princess",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: sleepyDeepSleeperI18n,
};
