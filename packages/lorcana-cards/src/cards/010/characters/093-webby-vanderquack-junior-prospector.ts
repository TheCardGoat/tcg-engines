import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackJuniorProspector: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "y1i-1",
      keyword: "Shift",
      text: "Shift 2 {I}",
      type: "keyword",
    },
    {
      id: "y1i-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "y1i-3",
      name: "WORK SMARTER",
      text: "WORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "7ab0ed76635e58a4c34c39be26bf83aa674be0c4",
  },
  franchise: "Ducktales",
  fullName: "Webby Vanderquack - Junior Prospector",
  id: "y1i",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Webby Vanderquack",
  set: "010",
  strength: 2,
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Junior Prospector",
  willpower: 4,
};
