import type { CharacterCard } from "@tcg/lorcana-types";

export const antonioMadrigalFriendToAll: CharacterCard = {
  id: "v9i",
  cardType: "character",
  name: "Antonio Madrigal",
  version: "Friend to All",
  fullName: "Antonio Madrigal - Friend to All",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 5,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "032142a4ff0a2d57c066e32be096f9670d1c7182",
  },
  abilities: [
    {
      id: "v9i-1",
      type: "triggered",
      name: "OF COURSE THEY CAN COME Once",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "search-deck",
          putInto: "hand",
          shuffle: true,
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
