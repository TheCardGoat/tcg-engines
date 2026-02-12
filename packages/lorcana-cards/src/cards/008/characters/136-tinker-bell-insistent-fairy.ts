import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellInsistentFairy: CharacterCard = {
  abilities: [
    {
      id: "ay2-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      id: "ay2-2",
      name: "PAY ATTENTION",
      text: "PAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 136,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 2,
  externalIds: {
    ravensburger: "277378a21856338f8273ccfc4abe9e49ad10589d",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Insistent Fairy",
  id: "ay2",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tinker Bell",
  set: "008",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
  version: "Insistent Fairy",
  willpower: 1,
};
