import type { CharacterCard } from "@tcg/lorcana-types";

export const antoniosJaguarFaithfulCompanion: CharacterCard = {
  abilities: [
    {
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
      id: "c5s-1",
      name: "YOU WANT TO GO WHERE?",
      text: "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 31,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "2bd3ff14879c7e1662527fb1bad60bcf2c1c5e4d",
  },
  franchise: "Encanto",
  fullName: "Antonio's Jaguar - Faithful Companion",
  id: "c5s",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Antonio's Jaguar",
  set: "008",
  strength: 1,
  text: "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
  version: "Faithful Companion",
  willpower: 4,
};
