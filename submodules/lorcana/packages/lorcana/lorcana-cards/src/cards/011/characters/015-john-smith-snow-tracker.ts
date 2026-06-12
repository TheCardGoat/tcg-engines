import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSmithSnowTrackerI18n } from "./015-john-smith-snow-tracker.i18n";

export const johnSmithSnowTracker: CharacterCard = {
  id: "HJJ",
  canonicalId: "ci_HJJ",
  reprints: ["set11-015"],
  cardType: "character",
  name: "John Smith",
  version: "Snow Tracker",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 15,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b1c578429eb547b3b5908a637c491c3e",
    tcgPlayer: 674828,
  },
  text: [
    {
      title: "FOLLOW THE TRACKS",
      description:
        "At the end of your turn, if this character is exerted and none of your characters challenged this turn, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "11a-1",
      name: "FOLLOW THE TRACKS",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "and",
        conditions: [
          {
            type: "is-exerted",
          },
          {
            type: "turn-metric",
            metric: "challenges-by-player",
            comparison: {
              operator: "eq",
              value: 0,
            },
            playerScope: "you",
          },
        ],
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      type: "triggered",
      text: "FOLLOW THE TRACKS At the end of your turn, if this character is exerted and none of your characters challenged this turn, gain 1 lore.",
    },
  ],
  i18n: johnSmithSnowTrackerI18n,
};
