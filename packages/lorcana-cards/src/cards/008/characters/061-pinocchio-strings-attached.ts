import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioStringsAttached: CharacterCard = {
  abilities: [
    {
      id: "1m2-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1m2-2",
      name: "GOT TO KEEP REAL QUIET Once",
      text: "GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 61,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "d1396676855ab97c647e729d53fd35c6e0ab3eda",
  },
  franchise: "Pinocchio",
  fullName: "Pinocchio - Strings Attached",
  id: "1m2",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Pinocchio",
  set: "008",
  strength: 0,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nGOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
  version: "Strings Attached",
  willpower: 4,
};
