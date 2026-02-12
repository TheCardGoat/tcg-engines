import type { CharacterCard } from "@tcg/lorcana-types";

export const theMusesProclaimersOfHeroes: CharacterCard = {
  abilities: [
    {
      id: "1x8-1",
      keyword: "Ward",
      text: "Ward",
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
      id: "1x8-2",
      name: "THE GOSPEL TRUTH",
      text: "THE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "f9536062101bef78b378b2a25c8f9677d0a8486b",
  },
  franchise: "Hercules",
  fullName: "The Muses - Proclaimers of Heroes",
  id: "1x8",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Muses",
  set: "004",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
  version: "Proclaimers of Heroes",
  willpower: 4,
};
