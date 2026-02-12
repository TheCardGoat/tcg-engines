import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyMissParkAvenue: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "188-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
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
      id: "188-2",
      name: "SOMETHING WONDERFUL",
      text: "SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 28,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "9f61c69f6fd196f8a513e41f12c5e1940c07dc32",
  },
  franchise: "Lady and the Tramp",
  fullName: "Lady - Miss Park Avenue",
  id: "188",
  inkType: ["amber", "emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Lady",
  set: "007",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
  version: "Miss Park Avenue",
  willpower: 4,
};
