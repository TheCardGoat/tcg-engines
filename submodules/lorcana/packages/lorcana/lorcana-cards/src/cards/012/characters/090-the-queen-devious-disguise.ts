import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenDeviousDisguiseI18n } from "./090-the-queen-devious-disguise.i18n";

export const theQueenDeviousDisguise: CharacterCard = {
  id: "eWy",
  canonicalId: "ci_eWy",
  reprints: ["set12-090"],
  cardType: "character",
  name: "The Queen",
  version: "Devious Disguise",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 90,
  rarity: "legendary",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_676cc0d5efcc4e34ae01d912295510eb",
  },
  text: [
    {
      title: "EVIL SCHEME",
      description:
        "When you play this character, you may draw a card. If you do, each opponent gains 2 lore.",
    },
    {
      title: "JEALOUS HEART",
      description: "While an opponent has more lore than you, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "eWy-1",
      name: "EVIL SCHEME",
      type: "triggered",
      text: "EVIL SCHEME When you play this character, you may draw a card. If you do, each opponent gains 2 lore.",
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
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "gain-lore",
              amount: 2,
              target: "EACH_OPPONENT",
            },
          },
        ],
      },
    },
    {
      id: "eWy-2",
      name: "JEALOUS HEART",
      type: "static",
      text: "JEALOUS HEART While an opponent has more lore than you, this character gets +2 {L}.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      condition: {
        type: "comparison",
        left: {
          type: "lore",
          controller: "opponent",
        },
        comparison: "greater",
        right: {
          type: "lore",
          controller: "you",
        },
      },
    },
  ],
  i18n: theQueenDeviousDisguiseI18n,
};
