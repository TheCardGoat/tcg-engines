import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExtremeAthlete: CharacterCard = {
  abilities: [
    {
      id: "15u-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "15u-2",
      name: "STAR POWER",
      text: "STAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "96d401c6b682205be0432b7df1aee5a9856f9a11",
  },
  fullName: "Goofy - Extreme Athlete",
  id: "15u",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Goofy",
  set: "007",
  strength: 7,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  version: "Extreme Athlete",
  willpower: 6,
};
