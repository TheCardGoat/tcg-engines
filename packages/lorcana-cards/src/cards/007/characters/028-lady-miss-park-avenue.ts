import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyMissParkAvenue: CharacterCard = {
  id: "188",
  cardType: "character",
  name: "Lady",
  version: "Miss Park Avenue",
  fullName: "Lady - Miss Park Avenue",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 28,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9f61c69f6fd196f8a513e41f12c5e1940c07dc32",
  },
  abilities: [
    {
      id: "188-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "188-2",
      type: "triggered",
      name: "SOMETHING WONDERFUL",
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
      text: "SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
