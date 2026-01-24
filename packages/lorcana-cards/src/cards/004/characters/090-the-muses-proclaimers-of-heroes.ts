import type { CharacterCard } from "@tcg/lorcana-types";

export const theMusesProclaimersOfHeroes: CharacterCard = {
  id: "1x8",
  cardType: "character",
  name: "The Muses",
  version: "Proclaimers of Heroes",
  fullName: "The Muses - Proclaimers of Heroes",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f9536062101bef78b378b2a25c8f9677d0a8486b",
  },
  abilities: [
    {
      id: "1x8-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1x8-2",
      type: "triggered",
      name: "THE GOSPEL TRUTH",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
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
      text: "THE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
