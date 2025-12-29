import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchRockStar: CharacterCard = {
  id: "y9k",
  cardType: "character",
  name: "Stitch",
  version: "Rock Star",
  fullName: "Stitch - Rock Star",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Stitch.)\nADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 3,
  inkable: true,
  externalIds: {
    ravensburger: "7b7f04e633966caf889d94df0f18c427dd6306f6",
  },
  abilities: [
    {
      id: "y9k-1",
      text: "Shift 4 {I}",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    },
    {
      id: "y9k-2",
      text: "ADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
      name: "ADORING FANS",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Alien"],
};
