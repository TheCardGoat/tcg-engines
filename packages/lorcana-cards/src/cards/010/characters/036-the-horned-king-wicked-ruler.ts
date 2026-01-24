import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingWickedRuler: CharacterCard = {
  id: "wsd",
  cardType: "character",
  name: "The Horned King",
  version: "Wicked Ruler",
  fullName: "The Horned King - Wicked Ruler",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named The Horned King.)\nARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 36,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "762bf4996db320a872b029620a950194a7fa82e0",
  },
  abilities: [
    {
      id: "wsd-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2 {I}",
    },
    {
      id: "wsd-2",
      type: "triggered",
      name: "ARISE!",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Sorcerer"],
};
