import type { CharacterCard } from "@tcg/lorcana-types";

export const antoniosJaguarFaithfulCompanion: CharacterCard = {
  id: "c5s",
  cardType: "character",
  name: "Antonio's Jaguar",
  version: "Faithful Companion",
  fullName: "Antonio's Jaguar - Faithful Companion",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "008",
  text: "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 31,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2bd3ff14879c7e1662527fb1bad60bcf2c1c5e4d",
  },
  abilities: [
    {
      id: "c5s-1",
      type: "triggered",
      name: "YOU WANT TO GO WHERE?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Antonio Madrigal in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
