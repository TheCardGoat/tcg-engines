import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaIslandExplorer: CharacterCard = {
  id: "1rb",
  cardType: "character",
  name: "Moana",
  version: "Island Explorer",
  fullName: "Moana - Island Explorer",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 134,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4393d614409dae5df4ecdd00e5bd3f488227461",
  },
  abilities: [
    {
      id: "1rb-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1rb-2",
      type: "triggered",
      name: "ADVENTUROUS SPIRIT",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "ADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
