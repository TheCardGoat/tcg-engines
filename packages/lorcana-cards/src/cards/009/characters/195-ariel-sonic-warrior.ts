import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSonicWarrior: CharacterCard = {
  id: "tfb",
  cardType: "character",
  name: "Ariel",
  version: "Sonic Warrior",
  fullName: "Ariel - Sonic Warrior",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Ariel.)\nAMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 195,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6a0d7fa630c6ddef725f555467e4c5b51515a664",
  },
  abilities: [
    {
      id: "tfb-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "tfb-2",
      type: "triggered",
      name: "AMPLIFIED VOICE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 3,
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
      text: "AMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
