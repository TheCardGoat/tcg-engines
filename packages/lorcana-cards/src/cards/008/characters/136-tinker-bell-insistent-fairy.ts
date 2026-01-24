import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellInsistentFairy: CharacterCard = {
  id: "ay2",
  cardType: "character",
  name: "Tinker Bell",
  version: "Insistent Fairy",
  fullName: "Tinker Bell - Insistent Fairy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 136,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "277378a21856338f8273ccfc4abe9e49ad10589d",
  },
  abilities: [
    {
      id: "ay2-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "ay2-2",
      type: "triggered",
      name: "PAY ATTENTION",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      text: "PAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
