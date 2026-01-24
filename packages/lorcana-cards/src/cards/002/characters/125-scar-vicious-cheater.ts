import type { CharacterCard } from "@tcg/lorcana-types";

export const scarViciousCheater: CharacterCard = {
  id: "1re",
  cardType: "character",
  name: "Scar",
  version: "Vicious Cheater",
  fullName: "Scar - Vicious Cheater",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  text: "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 125,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e36200725d9e116115b62410d83a714d9c837c7a",
  },
  abilities: [
    {
      id: "1re-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1re-2",
      type: "triggered",
      name: "DADDY ISN'T HERE TO SAVE YOU",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "SELF",
          duration: "this-turn",
        },
        chooser: "CONTROLLER",
      },
      text: "DADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
