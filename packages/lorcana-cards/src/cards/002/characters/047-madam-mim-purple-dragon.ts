import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimPurpleDragon: CharacterCard = {
  id: "12t",
  cardType: "character",
  name: "Madam Mim",
  version: "Purple Dragon",
  fullName: "Madam Mim - Purple Dragon",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 4,
  cardNumber: 47,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8beb7231237cf3bc2a7b1289fd773536113e9112",
  },
  abilities: [
    {
      id: "12t-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "12t-2",
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
        optionLabels: [
          "I WIN, I WIN! When you play this character, banish her",
          "return another 2 chosen characters of yours to your hand.",
        ],
      },
      text: "I WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Dragon"],
};
