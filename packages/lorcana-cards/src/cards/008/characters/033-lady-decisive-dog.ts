import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyDecisiveDog: CharacterCard = {
  id: "4k5",
  cardType: "character",
  name: "Lady",
  version: "Decisive Dog",
  fullName: "Lady - Decisive Dog",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.\nTAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 33,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "106ec8559ac405ebee11dd588931147b5cc81ebd",
  },
  abilities: [
    {
      id: "4k5-1",
      type: "triggered",
      name: "PACK OF HER OWN",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.",
    },
    {
      id: "4k5-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
