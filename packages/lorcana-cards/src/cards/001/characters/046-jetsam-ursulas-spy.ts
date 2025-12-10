import type { CharacterCard } from "@tcg/lorcana";

export const jetsamUrsulasSpy: CharacterCard = {
  id: "cdv",
  cardType: "character",
  name: "Jetsam",
  version: "Ursula’s Spy",
  fullName: "Jetsam - Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSINISTER SLITHER Your characters named Flotsam gain Evasive.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  externalIds: {
    ravensburger: "2ca35abecd4db3d354a35de835504ac0657f0a85",
  },
  abilities: [
    {
      id: "cdv-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "cdv-2",
      text: "SINISTER SLITHER Your characters named Flotsam gain Evasive.",
      name: "SINISTER SLITHER",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        duration: "turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
