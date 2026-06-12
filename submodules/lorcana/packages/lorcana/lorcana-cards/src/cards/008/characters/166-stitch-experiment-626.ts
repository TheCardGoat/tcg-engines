import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchExperiment626I18n } from "./166-stitch-experiment-626.i18n";

export const stitchExperiment626: CharacterCard = {
  id: "fkl",
  canonicalId: "ci_jjP",
  reprints: ["set8-166"],
  cardType: "character",
  name: "Stitch",
  version: "Experiment 626",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "008",
  cardNumber: 166,
  rarity: "legendary",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1a6358dd0385477eb83213749cb5d38f",
    tcgPlayer: 633104,
  },
  text: [
    {
      title: "SO NAUGHTY",
      description:
        "When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.",
    },
    {
      title: "STEALTH MODE",
      description:
        "At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "OPPONENT",
        type: "put-into-inkwell",
      },
      id: "bxo-1",
      name: "SO NAUGHTY",
      text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              filters: [
                {
                  type: "attribute",
                  attribute: "inkwell",
                  value: true,
                },
              ],
            },
            {
              type: "play-card",
              from: "discard",
              cost: "free",
              entersExerted: true,
              filter: {
                sameInstanceAsSource: true,
              },
            },
          ],
        },
        type: "optional",
      },
      id: "bxo-2",
      name: "STEALTH MODE",
      sourceZones: ["discard"],
      text: "STEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: stitchExperiment626I18n,
};
