import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamUrsulasBaby: CharacterCard = {
  id: "1e2",
  cardType: "character",
  name: "Flotsam",
  version: 'Ursula\'s "Baby"',
  fullName: 'Flotsam - Ursula\'s "Baby"',
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "QUICK ESCAPE When this character is banished in a challenge, return this card to your hand.\nOMINOUS PAIR Your characters named Jetsam gain “When this character is banished in a challenge, return this card to your hand.”",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 43,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b522f69e8b55e7da75eb298f56319d3827cae2d5",
  },
  abilities: [
    {
      id: "1e2-1",
      type: "triggered",
      name: "QUICK ESCAPE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "QUICK ESCAPE When this character is banished in a challenge, return this card to your hand.",
    },
    {
      id: "1e2-2",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "OMINOUS PAIR Your characters named Jetsam gain “When this character is banished in a challenge, return this card to your hand.”",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
