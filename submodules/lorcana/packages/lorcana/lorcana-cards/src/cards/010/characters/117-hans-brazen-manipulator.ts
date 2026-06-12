import type { CharacterCard } from "@tcg/lorcana-types";
import { hansBrazenManipulatorI18n } from "./117-hans-brazen-manipulator.i18n";

export const hansBrazenManipulator: CharacterCard = {
  id: "8Rp",
  canonicalId: "ci_8Rp",
  reprints: ["set10-117"],
  cardType: "character",
  name: "Hans",
  version: "Brazen Manipulator",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 117,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c8a9d4fc3bd241468dc26f8415bea95a",
    tcgPlayer: 659620,
  },
  text: [
    {
      title: "JOSTLING FOR POWER",
      description: "King and Queen characters can't quest.",
    },
    {
      title: "GROWING INFLUENCE",
      description:
        "At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      effect: {
        restriction: "cant-quest",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "or",
              filters: [
                {
                  type: "has-classification",
                  classification: "King",
                },
                {
                  type: "has-classification",
                  classification: "Queen",
                },
              ],
            },
          ],
        },
        type: "restriction",
      },
      id: "bkr-1",
      name: "JOSTLING FOR POWER",
      text: "JOSTLING FOR POWER King and Queen characters can't quest.",
      type: "static",
    },
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "ready",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "bkr-2",
      name: "GROWING INFLUENCE",
      text: "GROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: hansBrazenManipulatorI18n,
};
