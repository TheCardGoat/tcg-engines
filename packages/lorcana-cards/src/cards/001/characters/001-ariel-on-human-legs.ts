import type { CharacterCard } from "@tcg/lorcana-types";

export const ArielOnHumanLegs: CharacterCard = {
  id: "2c9",
  cardType: "character",
  name: "Ariel",
  version: "On Human Legs",
  fullName: "Ariel - On Human Legs",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "VOICELESS This character can't {E} to sing songs.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 1,
  inkable: true,
  externalIds: {
    ravensburger: "086f72176bc2fbb2a19898745a8218e1fe826c00",
  },
  abilities: [
    {
      id: "2c9-1",
      text: "VOICELESS This character can't {E} to sing songs.",
      name: "VOICELESS",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
