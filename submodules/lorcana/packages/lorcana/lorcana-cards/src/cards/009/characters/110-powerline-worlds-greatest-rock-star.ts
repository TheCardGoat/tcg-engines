import type { CharacterCard } from "@tcg/lorcana-types";
import { powerlineWorldsGreatestRockStarI18n } from "./110-powerline-worlds-greatest-rock-star.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { singer } from "../../../helpers/abilities/singer";

export const powerlineWorldsGreatestRockStar: CharacterCard = {
  id: "PmB",
  canonicalId: "ci_O1h",
  reprints: ["set9-110"],
  cardType: "character",
  name: "Powerline",
  version: "World's Greatest Rock Star",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 110,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_be9c85638bda44878c44cf4cc7e7cfb0",
    tcgPlayer: 649231,
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Singer 9",
    },
    {
      title: "MASH-UP",
      description:
        "Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn"],
  abilities: [
    shift(4),
    singer(9),
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "play",
            min: 0,
            max: 1,
            reveal: true,
            cost: "free",
            filters: [
              {
                type: "song",
              },
              {
                type: "cost",
                comparison: "lte",
                value: 9,
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "k9i-3",
      name: "MASH-UP",
      text: "MASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "sing",
        on: "SELF",
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
  i18n: powerlineWorldsGreatestRockStarI18n,
};
