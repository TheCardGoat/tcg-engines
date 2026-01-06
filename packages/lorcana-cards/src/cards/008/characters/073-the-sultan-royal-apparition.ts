import type { CharacterCard } from "@tcg/lorcana-types";

export const theSultanRoyalApparition: CharacterCard = {
  id: "nun",
  cardType: "character",
  name: "The Sultan",
  version: "Royal Apparition",
  fullName: "The Sultan - Royal Apparition",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 73,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "55f69fe83954df53e85b4424654b817eb81e9f0b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "King", "Illusion"],
};
