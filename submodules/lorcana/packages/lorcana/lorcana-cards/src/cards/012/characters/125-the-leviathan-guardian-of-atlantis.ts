import type { CharacterCard } from "@tcg/lorcana-types";
import { theLeviathanGuardianOfAtlantisI18n } from "./125-the-leviathan-guardian-of-atlantis.i18n";

export const theLeviathanGuardianOfAtlantis: CharacterCard = {
  id: "lYe",
  canonicalId: "ci_lYe",
  reprints: ["set12-125"],
  cardType: "character",
  name: "The Leviathan",
  version: "Guardian of Atlantis",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 125,
  rarity: "common",
  cost: 10,
  strength: 10,
  willpower: 10,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_0a72279b05f0453399584e40b7caaa1d",
  },
  text: [
    {
      title: "IT'S",
      description:
        "A MACHINE! When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total {} 10 or less.",
    },
  ],
  classifications: ["Dreamborn", "Monster", "Robot"],
  abilities: [
    {
      id: "lYe-1",
      name: "IT'S A MACHINE!",
      type: "triggered",
      text: "IT'S A MACHINE! When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total cost 10 or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: {
              upTo: 10,
            },
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
            totalStrengthBudget: 10,
          },
        },
      },
    },
  ],
  i18n: theLeviathanGuardianOfAtlantisI18n,
};
