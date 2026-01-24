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
  missingTests: true,
  externalIds: {
    ravensburger: "55f69fe83954df53e85b4424654b817eb81e9f0b",
  },
  abilities: [
    {
      id: "nun-1",
      type: "keyword",
      keyword: "Vanish",
      text: "Vanish",
    },
    {
      id: "nun-2",
      type: "triggered",
      name: "COMMANDING PRESENCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "COMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "King", "Illusion"],
};
