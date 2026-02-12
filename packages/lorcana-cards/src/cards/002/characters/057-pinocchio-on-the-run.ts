import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioOnTheRun: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "186-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "186-2",
      name: "LISTEN TO YOUR CONSCIENCE",
      text: "LISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 57,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "9f2f8c38e0d5bc874368f36fa428ddb654ec140d",
  },
  franchise: "Pinocchio",
  fullName: "Pinocchio - On the Run",
  id: "186",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Pinocchio",
  set: "002",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
  version: "On the Run",
  willpower: 3,
};
