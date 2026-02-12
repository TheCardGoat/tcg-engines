import type { CharacterCard } from "@tcg/lorcana-types";

export const goGoTomagoDartingDynamo: CharacterCard = {
  abilities: [
    {
      id: "1b9-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1b9-2",
      text: "STOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
      type: "action",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 2,
  externalIds: {
    ravensburger: "aa571ab1daf373cf1e599119acfe9463dd530dbc",
  },
  franchise: "Big Hero 6",
  fullName: "Go Go Tomago - Darting Dynamo",
  id: "1b9",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Go Go Tomago",
  set: "006",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
  version: "Darting Dynamo",
  willpower: 2,
};
