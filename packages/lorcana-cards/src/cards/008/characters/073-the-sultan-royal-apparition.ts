import type { CharacterCard } from "@tcg/lorcana-types";

export const theSultanRoyalApparition: CharacterCard = {
  abilities: [
    {
      id: "nun-1",
      keyword: "Vanish",
      text: "Vanish",
      type: "keyword",
    },
    {
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
      id: "nun-2",
      name: "COMMANDING PRESENCE",
      text: "COMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "King", "Illusion"],
  cost: 5,
  externalIds: {
    ravensburger: "55f69fe83954df53e85b4424654b817eb81e9f0b",
  },
  franchise: "Aladdin",
  fullName: "The Sultan - Royal Apparition",
  id: "nun",
  inkType: ["amethyst", "steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "The Sultan",
  set: "008",
  strength: 5,
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
  version: "Royal Apparition",
  willpower: 5,
};
