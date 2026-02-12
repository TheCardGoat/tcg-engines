import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSonicWarrior: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "tfb-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
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
      id: "tfb-2",
      name: "AMPLIFIED VOICE",
      text: "AMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 195,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "6a0d7fa630c6ddef725f555467e4c5b51515a664",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Sonic Warrior",
  id: "tfb",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Ariel",
  set: "009",
  strength: 3,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Ariel.)\nAMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
  version: "Sonic Warrior",
  willpower: 8,
};
