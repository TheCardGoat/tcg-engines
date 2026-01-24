import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounCourageousRescuer: CharacterCard = {
  id: "1m4",
  cardType: "character",
  name: "Calhoun",
  version: "Courageous Rescuer",
  fullName: "Calhoun - Courageous Rescuer",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d15917edc226a4d5a0f74f8b78306c814c3c1a48",
  },
  abilities: [
    {
      id: "1m4-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1m4-2",
      type: "triggered",
      name: "BACK TO START POSITIONS!",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "BACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Racer"],
};
