import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounCourageousRescuer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1m4-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1m4-2",
      name: "BACK TO START POSITIONS!",
      text: "BACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 26,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Racer"],
  cost: 6,
  externalIds: {
    ravensburger: "d15917edc226a4d5a0f74f8b78306c814c3c1a48",
  },
  franchise: "Wreck It Ralph",
  fullName: "Calhoun - Courageous Rescuer",
  id: "1m4",
  inkType: ["amber", "ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Calhoun",
  set: "007",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
  version: "Courageous Rescuer",
  willpower: 5,
};
