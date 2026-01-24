import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBadGuy: CharacterCard = {
  id: "kek",
  cardType: "character",
  name: "Pete",
  version: "Bad Guy",
  fullName: "Pete - Bad Guy",
  inkType: ["emerald"],
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "498a07d34db6a52ef27e29b54a76950cc05708d7",
  },
  abilities: [
    {
      id: "kek-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "kek-2",
      type: "triggered",
      name: "TAKE THAT!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "TAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.",
    },
    {
      id: "kek-3",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "WHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
