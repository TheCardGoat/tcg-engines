import type { CharacterCard } from "@tcg/lorcana";

export const iagoPrettyPolly: CharacterCard = {
  id: "d7s",
  cardType: "character",
  name: "Iago",
  version: "Pretty Polly",
  fullName: "Iago - Pretty Polly",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "040",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "2fa1ceaaf0d1dd9e4204f55a9c73c7ef3b00dcb7",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "d7sa1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
