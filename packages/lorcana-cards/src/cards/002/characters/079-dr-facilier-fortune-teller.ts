import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierFortuneTeller: CharacterCard = {
  id: "h8r",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Fortune Teller",
  fullName: "Dr. Facilier - Fortune Teller",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.",
  cost: 7,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 79,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3e258200882f4b5dcbec8289f3c82c2c45974698",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
