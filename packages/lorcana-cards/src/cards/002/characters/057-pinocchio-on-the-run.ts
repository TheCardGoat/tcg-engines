import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioOnTheRun: CharacterCard = {
  id: "186",
  cardType: "character",
  name: "Pinocchio",
  version: "On the Run",
  fullName: "Pinocchio - On the Run",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 57,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9f2f8c38e0d5bc874368f36fa428ddb654ec140d",
  },
  abilities: [
    {
      id: "186-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "186-2",
      type: "triggered",
      name: "LISTEN TO YOUR CONSCIENCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
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
      text: "LISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
