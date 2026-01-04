import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioStringsAttached: CharacterCard = {
  id: "1m2",
  cardType: "character",
  name: "Pinocchio",
  version: "Strings Attached",
  fullName: "Pinocchio - Strings Attached",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nGOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 61,
  inkable: true,
  externalIds: {
    ravensburger: "d1396676855ab97c647e729d53fd35c6e0ab3eda",
  },
  abilities: [
    {
      id: "1m2-1",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "1m2-2",
      name: "GOT TO KEEP REAL QUIET Once",
      type: "triggered",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
