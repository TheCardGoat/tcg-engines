import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamUrsulasBaby: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "1e2-1",
      name: "QUICK ESCAPE",
      text: "QUICK ESCAPE When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "1e2-2",
      text: "OMINOUS PAIR Your characters named Jetsam gain “When this character is banished in a challenge, return this card to your hand.”",
      type: "action",
    },
  ],
  cardNumber: 43,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b522f69e8b55e7da75eb298f56319d3827cae2d5",
  },
  franchise: "Little Mermaid",
  fullName: 'Flotsam - Ursula\'s "Baby"',
  id: "1e2",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Flotsam",
  set: "004",
  strength: 4,
  text: "QUICK ESCAPE When this character is banished in a challenge, return this card to your hand.\nOMINOUS PAIR Your characters named Jetsam gain “When this character is banished in a challenge, return this card to your hand.”",
  version: 'Ursula\'s "Baby"',
  willpower: 2,
};
