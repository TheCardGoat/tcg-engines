import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGiantFairy: CharacterCard = {
  id: "pf8",
  cardType: "character",
  name: "Tinker Bell",
  version: "Giant Fairy",
  fullName: "Tinker Bell - Giant Fairy",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Tinker Bell.)\nROCK THE BOAT When you play this character, deal 1 damage to each opposing character.\nPUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 188,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5ba0aae83bc08edf19274cb2f525d456366f647f",
  },
  abilities: [
    {
      id: "pf8-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "pf8-2",
      type: "triggered",
      name: "ROCK THE BOAT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "ROCK THE BOAT When you play this character, deal 1 damage to each opposing character.",
    },
    {
      id: "pf8-3",
      type: "triggered",
      name: "PUNY PIRATE!",
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
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "PUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
};
