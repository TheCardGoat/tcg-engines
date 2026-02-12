import type { CharacterCard } from "@tcg/lorcana-types";

export const scarViciousCheater: CharacterCard = {
  abilities: [
    {
      id: "1re-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
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
      id: "1re-2",
      name: "DADDY ISN'T HERE TO SAVE YOU",
      text: "DADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "e36200725d9e116115b62410d83a714d9c837c7a",
  },
  franchise: "Lion King",
  fullName: "Scar - Vicious Cheater",
  id: "1re",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Scar",
  set: "002",
  strength: 6,
  text: "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
  version: "Vicious Cheater",
  willpower: 5,
};
