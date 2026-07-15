import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimPurpleDragon: CharacterCard = {
  abilities: [
    {
      id: "12t-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        optionLabels: [
          "I WIN, I WIN! When you play this character, banish her",
          "return another 2 chosen characters of yours to your hand.",
        ],
        options: [
          {
            from: "hand",
            type: "play-card",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
        ],
        type: "choice",
      },
      id: "12t-2",
      text: "I WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
      type: "action",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer", "Dragon"],
  cost: 7,
  externalIds: {
    ravensburger: "8beb7231237cf3bc2a7b1289fd773536113e9112",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Purple Dragon",
  id: "12t",
  inkType: ["amethyst"],
  inkable: true,
  lore: 4,
  missingTests: true,
  name: "Madam Mim",
  set: "002",
  strength: 5,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
  version: "Purple Dragon",
  willpower: 7,
};
