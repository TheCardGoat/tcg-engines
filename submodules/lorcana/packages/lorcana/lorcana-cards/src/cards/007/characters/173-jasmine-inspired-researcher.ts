import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineInspiredResearcherI18n } from "./173-jasmine-inspired-researcher.i18n";

export const jasmineInspiredResearcher: CharacterCard = {
  id: "TlP",
  canonicalId: "ci_TlP",
  reprints: ["set7-173"],
  cardType: "character",
  name: "Jasmine",
  version: "Inspired Researcher",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 173,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_62c3a4d3b2234f26b7d63be72faf93a4",
    tcgPlayer: 619505,
  },
  text: [
    {
      title: "EXTRA ASSISTANCE",
      description:
        "Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Ally",
            },
          ],
        },
      },
      id: "4mp-1",
      name: "EXTRA ASSISTANCE",
      text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineInspiredResearcherI18n,
};
