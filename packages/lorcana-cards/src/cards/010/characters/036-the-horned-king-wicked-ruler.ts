import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingWickedRuler: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "wsd-1",
      keyword: "Shift",
      text: "Shift 2 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "wsd-2",
      name: "ARISE!",
      text: "ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "King", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "762bf4996db320a872b029620a950194a7fa82e0",
  },
  franchise: "Black Cauldron",
  fullName: "The Horned King - Wicked Ruler",
  id: "wsd",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "The Horned King",
  set: "010",
  strength: 3,
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named The Horned King.)\nARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
  version: "Wicked Ruler",
  willpower: 4,
};
