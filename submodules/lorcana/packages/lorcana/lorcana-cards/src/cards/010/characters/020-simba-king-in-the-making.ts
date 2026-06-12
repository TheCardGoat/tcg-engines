import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { simbaKingInTheMakingI18n } from "./020-simba-king-in-the-making.i18n";

export const simbaKingInTheMaking: CharacterCard = {
  id: "shC",
  canonicalId: "ci_IlR",
  reprints: ["set10-020"],
  cardType: "character",
  name: "Simba",
  version: "King in the Making",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "010",
  cardNumber: 20,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_54bfc0bd37f44871a4ef50193d58ca2c",
    tcgPlayer: 658449,
  },
  text: [
    {
      title: "Boost 3 {I}",
    },
    {
      title: "TIMELY ALLIANCE",
      description:
        "Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  abilities: [
    boost(3),
    {
      id: "dbt-2",
      type: "triggered",
      name: "TIMELY ALLIANCE",
      text: "TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "play",
              min: 0,
              max: 1,
              cost: "free",
              reveal: true,
              entersExerted: true,
              filters: [
                {
                  type: "card-type",
                  cardType: "character",
                },
              ],
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
      },
    },
  ],
  i18n: simbaKingInTheMakingI18n,
};
