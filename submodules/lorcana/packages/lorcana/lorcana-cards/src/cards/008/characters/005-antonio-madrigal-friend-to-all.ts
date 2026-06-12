import type { CharacterCard } from "@tcg/lorcana-types";
import { antonioMadrigalFriendToAllI18n } from "./005-antonio-madrigal-friend-to-all.i18n";

export const antonioMadrigalFriendToAll: CharacterCard = {
  id: "07V",
  canonicalId: "ci_07V",
  reprints: ["set8-005"],
  cardType: "character",
  name: "Antonio Madrigal",
  version: "Friend to All",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 5,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2564aee724494e5f99b9688aad48753f",
    tcgPlayer: 631703,
  },
  text: [
    {
      title: "OF COURSE THEY CAN COME",
      description:
        "Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          maxCost: 3,
          putInto: "hand",
          shuffle: true,
          type: "search-deck",
        },
        type: "optional",
      },
      id: "v9i-1",
      name: "OF COURSE THEY CAN COME",
      text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      trigger: {
        event: "sing",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: antonioMadrigalFriendToAllI18n,
};
