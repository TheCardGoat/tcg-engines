import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingMysteriousDuck: CharacterCard = {
  abilities: [
    {
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
      id: "ejj-1",
      name: "ARCANE CONNECTION",
      text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "3469f66d9abd9774d62799182860eab98d987ad2",
  },
  franchise: "Ducktales",
  fullName: "Lena Sabrewing - Mysterious Duck",
  id: "ejj",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lena Sabrewing",
  set: "010",
  strength: 3,
  text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
  version: "Mysterious Duck",
  willpower: 3,
};
