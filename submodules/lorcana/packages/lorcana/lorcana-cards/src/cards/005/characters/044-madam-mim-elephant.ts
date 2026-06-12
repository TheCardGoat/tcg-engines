import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimElephantI18n } from "./044-madam-mim-elephant.i18n";

export const madamMimElephant: CharacterCard = {
  id: "jUU",
  canonicalId: "ci_jUU",
  reprints: ["set5-044"],
  cardType: "character",
  name: "Madam Mim",
  version: "Elephant",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 44,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_68ff503b4be94f6cbf93a9b0cd097c80",
    tcgPlayer: 560092,
  },
  text: [
    {
      title: "A LITTLE GAME",
      description:
        "When you play this character, banish her or return another chosen character of yours to your hand.",
    },
    {
      title: "SNEAKY MOVE",
      description:
        "At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "1dn-1",
      name: "A LITTLE GAME",
      text: "A LITTLE GAME When you play this character, banish her or return another chosen character of yours to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      effect: {
        type: "or",
        optionLabels: ["banish her", "return another chosen character of yours to your hand"],
        options: [
          {
            target: "SELF",
            type: "banish",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              excludeSelf: true,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
        ],
      },
    },
    {
      id: "1dn-2",
      name: "SNEAKY MOVE",
      text: "SNEAKY MOVE At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
        condition: {
          type: "and",
          conditions: [
            {
              type: "target-query",
              query: {
                selector: "all",
                reference: "source",
                filters: [{ type: "damaged" }],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            {
              type: "target-query",
              query: {
                selector: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
          ],
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: {
            ref: "self",
          },
          to: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: madamMimElephantI18n,
};
