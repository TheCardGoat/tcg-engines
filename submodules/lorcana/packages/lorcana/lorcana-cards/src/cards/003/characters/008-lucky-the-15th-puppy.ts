import type { CharacterCard } from "@tcg/lorcana-types";
import { luckyThe15thPuppyI18n } from "./008-lucky-the-15th-puppy.i18n";

export const luckyThe15thPuppy: CharacterCard = {
  id: "nH3",
  canonicalId: "ci_nH3",
  reprints: ["set3-008"],
  cardType: "character",
  name: "Lucky",
  version: "The 15th Puppy",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  cardNumber: 8,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_885f1f8ac17a447fa3c9f7b668fa8663",
    tcgPlayer: 538354,
  },
  text: [
    {
      title: "GOOD AS NEW",
      description:
        "{E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.",
    },
    {
      title: "PUPPY LOVE",
      description:
        "Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "scry",
        amount: 3,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 3,
            reveal: true,
            filter: {
              type: "and",
              filters: [
                {
                  type: "card-type",
                  cardType: "character",
                },
                {
                  type: "cost-comparison",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "5ql-1",
      name: "GOOD AS NEW",
      text: "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.",
      type: "activated",
    },
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 4,
        },
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      id: "5ql-2",
      name: "PUPPY LOVE",
      text: "PUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: luckyThe15thPuppyI18n,
};
