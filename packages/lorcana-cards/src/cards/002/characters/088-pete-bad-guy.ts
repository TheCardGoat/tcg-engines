import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBadGuy: CharacterCard = {
  abilities: [
    {
      id: "kek-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "kek-2",
      name: "TAKE THAT!",
      text: "TAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "kek-3",
      text: "WHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.",
      type: "static",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "498a07d34db6a52ef27e29b54a76950cc05708d7",
  },
  fullName: "Pete - Bad Guy",
  id: "kek",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pete",
  set: "002",
  strength: 3,
  text: "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.",
  version: "Bad Guy",
  willpower: 4,
};
