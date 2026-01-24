import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingMysteriousDuck: CharacterCard = {
  id: "ejj",
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Mysterious Duck",
  fullName: "Lena Sabrewing - Mysterious Duck",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 42,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3469f66d9abd9774d62799182860eab98d987ad2",
  },
  abilities: [
    {
      id: "ejj-1",
      type: "triggered",
      name: "ARCANE CONNECTION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression:
            "you have a character or location in play with a card under them",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Sorcerer"],
};
