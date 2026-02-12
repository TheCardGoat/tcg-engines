import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkJuniorChipmunk: CharacterCard = {
  abilities: [
    {
      id: "6z5-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "6z5-2",
      name: "SCOUT LEADER",
      text: "SCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "1924f5a75ed46675b141cc31b8b1730cc15ddc6c",
  },
  franchise: "Emperors New Groove",
  fullName: "Kronk - Junior Chipmunk",
  id: "6z5",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Kronk",
  set: "002",
  strength: 4,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
  version: "Junior Chipmunk",
  willpower: 5,
};
