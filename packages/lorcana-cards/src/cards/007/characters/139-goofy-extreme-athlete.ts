import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExtremeAthlete: CharacterCard = {
  id: "15u",
  cardType: "character",
  name: "Goofy",
  version: "Extreme Athlete",
  fullName: "Goofy - Extreme Athlete",
  inkType: ["ruby"],
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  cost: 7,
  strength: 7,
  willpower: 6,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96d401c6b682205be0432b7df1aee5a9856f9a11",
  },
  abilities: [
    {
      id: "15u-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "15u-2",
      type: "triggered",
      name: "STAR POWER",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "STAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
