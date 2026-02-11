import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyDecisiveDog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "4k5-1",
      name: "PACK OF HER OWN",
      text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      id: "4k5-2",
      text: "TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
      type: "static",
    },
  ],
  cardNumber: 33,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 1,
  externalIds: {
    ravensburger: "106ec8559ac405ebee11dd588931147b5cc81ebd",
  },
  franchise: "Lady and the Tramp",
  fullName: "Lady - Decisive Dog",
  id: "4k5",
  inkType: ["amber", "emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lady",
  set: "008",
  strength: 0,
  text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.\nTAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
  version: "Decisive Dog",
  willpower: 3,
};
