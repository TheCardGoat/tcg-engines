import type { LocationCard } from "@tcg/lorcana-types";
import { ursulasLairEyeOfTheStormI18n } from "./068-ursulas-lair-eye-of-the-storm.i18n";

export const ursulasLairEyeOfTheStorm: LocationCard = {
  id: "U6D",
  canonicalId: "ci_U6D",
  reprints: ["set4-068"],
  cardType: "location",
  name: "Ursula’s Lair",
  version: "Eye of the Storm",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 68,
  rarity: "rare",
  cost: 3,
  willpower: 6,
  moveCost: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_70a2a01e064142b0a132d9ce3a86a293",
    tcgPlayer: 547784,
  },
  text: [
    {
      title: "SLIPPERY HALLS",
      description:
        "Whenever a character is banished in a challenge while here, you may return them to your hand.",
    },
    {
      title: "SEAT OF POWER",
      description: "Characters named Ursula get +1 {L} while here.",
    },
  ],
  abilities: [
    {
      id: "U6D-1",
      name: "SLIPPERY HALLS",
      text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            reference: "trigger-subject",
          },
        },
      },
    },
    {
      id: "U6D-2",
      name: "SEAT OF POWER",
      text: "SEAT OF POWER Characters named Ursula get +1 {L} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
            {
              type: "has-name",
              name: "Ursula",
            },
          ],
        },
      },
    },
  ],
  i18n: ursulasLairEyeOfTheStormI18n,
};
