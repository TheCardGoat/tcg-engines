import type { CharacterCard } from "@tcg/lorcana-types";
import { fixitFelixJrDelightedSightseerI18n } from "./017-fix-it-felix-jr-delighted-sightseer.i18n";

export const fixitFelixJrDelightedSightseer: CharacterCard = {
  id: "3wx",
  canonicalId: "ci_3wx",
  reprints: ["set5-017"],
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Delighted Sightseer",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 17,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a3a926925af4b4ca1cd8567c7a300ae",
    tcgPlayer: 559778,
  },
  text: [
    {
      title: "OH, MY LAND!",
      description: "When you play this character, if you have a location in play, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "108-1",
      name: "OH, MY LAND!",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "location",
          filters: [],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "OH, MY LAND! When you play this character, if you have a location in play, draw a card.",
    },
  ],
  i18n: fixitFelixJrDelightedSightseerI18n,
};
