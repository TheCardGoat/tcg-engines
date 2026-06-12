import type { CharacterCard } from "@tcg/lorcana-types";
import { ludwigVonDrakeAllaroundExpertI18n } from "./007-ludwig-von-drake-all-around-expert.i18n";

export const ludwigVonDrakeAllaroundExpert: CharacterCard = {
  id: "T22",
  canonicalId: "ci_T22",
  reprints: ["set8-007"],
  cardType: "character",
  name: "Ludwig Von Drake",
  version: "All-Around Expert",
  inkType: ["amber", "sapphire"],
  set: "008",
  cardNumber: 7,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a22eb000866a46439fd736cd7a8ec535",
    tcgPlayer: 631353,
  },
  text: [
    {
      title: "SUPERIOR MIND",
      description:
        "When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
    },
    {
      title: "LASTING LEGACY",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "T22-1",
      type: "triggered",
      name: "SUPERIOR MIND",
      text: "SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "this-card",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
      },
      id: "T22-2",
      name: "LASTING LEGACY",
      text: "LASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
    },
  ],
  i18n: ludwigVonDrakeAllaroundExpertI18n,
};
