import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackJuniorProspector: CharacterCard = {
  id: "y1i",
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Junior Prospector",
  fullName: "Webby Vanderquack - Junior Prospector",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ab0ed76635e58a4c34c39be26bf83aa674be0c4",
  },
  abilities: [
    {
      id: "y1i-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2 {I}",
    },
    {
      id: "y1i-2",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "y1i-3",
      type: "triggered",
      name: "WORK SMARTER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their inkwell than you",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      text: "WORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
