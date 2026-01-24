import type { CharacterCard } from "@tcg/lorcana-types";

export const galeWindSpirit: CharacterCard = {
  id: "1u4",
  cardType: "character",
  name: "Gale",
  version: "Wind Spirit",
  fullName: "Gale - Wind Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 42,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee97b532e414172bb38c8157f657b9cd0e101f22",
  },
  abilities: [
    {
      id: "1u4-1",
      type: "triggered",
      name: "RECURRING GUST",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
