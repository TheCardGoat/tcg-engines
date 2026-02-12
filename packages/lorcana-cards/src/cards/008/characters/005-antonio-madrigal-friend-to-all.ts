import type { CharacterCard } from "@tcg/lorcana-types";

export const antonioMadrigalFriendToAll: CharacterCard = {
  abilities: [
    {
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
      id: "v9i-1",
      name: "OF COURSE THEY CAN COME Once",
      text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 4,
  externalIds: {
    ravensburger: "032142a4ff0a2d57c066e32be096f9670d1c7182",
  },
  franchise: "Encanto",
  fullName: "Antonio Madrigal - Friend to All",
  id: "v9i",
  inkType: ["amber", "amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Antonio Madrigal",
  set: "008",
  strength: 2,
  text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  version: "Friend to All",
  willpower: 2,
};
