import type { CharacterCard } from "@tcg/lorcana-types";
import { grammaTalaKeeperOfAncientStoriesI18n } from "./142-gramma-tala-keeper-of-ancient-stories.i18n";

export const grammaTalaKeeperOfAncientStories: CharacterCard = {
  id: "1sm",
  canonicalId: "ci_1sm",
  reprints: ["set3-142"],
  cardType: "character",
  name: "Gramma Tala",
  version: "Keeper of Ancient Stories",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 142,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2b3c2bc74af94a07ae07634fb74f237b",
    tcgPlayer: 538361,
  },
  text: [
    {
      title: "THERE WAS ONLY OCEAN",
      description:
        "When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "1ga-1",
      name: "THERE WAS ONLY OCEAN",
      text: "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: grammaTalaKeeperOfAncientStoriesI18n,
};
