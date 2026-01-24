import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkJuniorChipmunk: CharacterCard = {
  id: "6z5",
  cardType: "character",
  name: "Kronk",
  version: "Junior Chipmunk",
  fullName: "Kronk - Junior Chipmunk",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 185,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1924f5a75ed46675b141cc31b8b1730cc15ddc6c",
  },
  abilities: [
    {
      id: "6z5-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "6z5-2",
      type: "triggered",
      name: "SCOUT LEADER",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
