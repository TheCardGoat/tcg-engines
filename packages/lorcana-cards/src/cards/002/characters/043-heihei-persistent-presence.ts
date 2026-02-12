import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiPersistentPresence: CharacterCard = {
  abilities: [
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "1a9-1",
      name: "HE'S BACK!",
      text: "HE'S BACK! When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 43,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "a6b5ad0750d9770259ba18ba82b625783ad4c125",
  },
  franchise: "Moana",
  fullName: "HeiHei - Persistent Presence",
  id: "1a9",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "HeiHei",
  set: "002",
  strength: 2,
  text: "HE'S BACK! When this character is banished in a challenge, return this card to your hand.",
  version: "Persistent Presence",
  willpower: 1,
};
