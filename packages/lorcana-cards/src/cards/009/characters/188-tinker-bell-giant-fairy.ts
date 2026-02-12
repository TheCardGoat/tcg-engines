import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGiantFairy: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "pf8-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
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
      id: "pf8-2",
      name: "ROCK THE BOAT",
      text: "ROCK THE BOAT When you play this character, deal 1 damage to each opposing character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
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
      id: "pf8-3",
      name: "PUNY PIRATE!",
      text: "PUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Fairy"],
  cost: 6,
  externalIds: {
    ravensburger: "5ba0aae83bc08edf19274cb2f525d456366f647f",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Giant Fairy",
  id: "pf8",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tinker Bell",
  set: "009",
  strength: 4,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Tinker Bell.)\nROCK THE BOAT When you play this character, deal 1 damage to each opposing character.\nPUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  version: "Giant Fairy",
  willpower: 5,
};
