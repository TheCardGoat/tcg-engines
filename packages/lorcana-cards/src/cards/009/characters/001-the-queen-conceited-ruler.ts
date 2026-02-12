import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenConceitedRuler: CharacterCard = {
  abilities: [
    {
      id: "3l5-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      id: "3l5-2",
      text: "ROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "0cede355df598a9f697223c219d919e3acdeee38",
  },
  franchise: "Snow White",
  fullName: "The Queen - Conceited Ruler",
  id: "3l5",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Queen",
  set: "009",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
  version: "Conceited Ruler",
  willpower: 4,
};
