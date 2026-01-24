import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenConceitedRuler: CharacterCard = {
  id: "3l5",
  cardType: "character",
  name: "The Queen",
  version: "Conceited Ruler",
  fullName: "The Queen - Conceited Ruler",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 1,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0cede355df598a9f697223c219d919e3acdeee38",
  },
  abilities: [
    {
      id: "3l5-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "3l5-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      text: "ROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};
