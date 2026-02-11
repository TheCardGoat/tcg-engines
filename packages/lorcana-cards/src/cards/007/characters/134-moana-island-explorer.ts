import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaIslandExplorer: CharacterCard = {
  abilities: [
    {
      id: "1rb-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
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
      id: "1rb-2",
      name: "ADVENTUROUS SPIRIT",
      text: "ADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 134,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "e4393d614409dae5df4ecdd00e5bd3f488227461",
  },
  franchise: "Moana",
  fullName: "Moana - Island Explorer",
  id: "1rb",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Moana",
  set: "007",
  strength: 4,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
  version: "Island Explorer",
  willpower: 3,
};
