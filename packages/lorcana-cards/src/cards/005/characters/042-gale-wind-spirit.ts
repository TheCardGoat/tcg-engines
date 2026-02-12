import type { CharacterCard } from "@tcg/lorcana-types";

export const galeWindSpirit: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "1u4-1",
      name: "RECURRING GUST",
      text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "ee97b532e414172bb38c8157f657b9cd0e101f22",
  },
  franchise: "Frozen",
  fullName: "Gale - Wind Spirit",
  id: "1u4",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Gale",
  set: "005",
  strength: 1,
  text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
  version: "Wind Spirit",
  willpower: 2,
};
