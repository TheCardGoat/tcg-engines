import type { CharacterCard } from "@tcg/lorcana-types";
import { bambiEtherealFawnI18n } from "./024-bambi-ethereal-fawn.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const bambiEtherealFawn: CharacterCard = {
  id: "Ab7",
  canonicalId: "ci_Ab7",
  reprints: ["set11-024"],
  cardType: "character",
  name: "Bambi",
  version: "Ethereal Fawn",
  inkType: ["amber"],
  franchise: "Bambi",
  set: "011",
  cardNumber: 24,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_33a165a8153e4ba587d52961bca86f79",
    tcgPlayer: 676190,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "COME SEE!",
      description:
        "During your turn, whenever this character exerts, reveal a number of cards from the top of your deck equal to the number of cards under him. Put all revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "1ye-2",
      condition: {
        type: "has-card-under",
      },
      effect: {
        type: "scry",
        amount: {
          type: "cards-under-self",
        },
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
            ],
            reveal: true,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      name: "COME SEE!",
      trigger: {
        event: "exert",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
      text: "COME SEE! During your turn, whenever this character exerts, reveal a number of cards from the top of your deck equal to the number of cards under him. Put all revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: bambiEtherealFawnI18n,
};
