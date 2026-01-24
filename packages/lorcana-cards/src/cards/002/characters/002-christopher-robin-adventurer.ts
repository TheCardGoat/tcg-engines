import type { CharacterCard } from "@tcg/lorcana-types";

export const christopherRobinAdventurer: CharacterCard = {
  id: "2pm",
  cardType: "character",
  name: "Christopher Robin",
  version: "Adventurer",
  fullName: "Christopher Robin - Adventurer",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "09c622f4623326886425e229b1bd88910dc489bc",
  },
  abilities: [
    {
      id: "2pm-1",
      type: "triggered",
      name: "WE'LL ALWAYS BE TOGETHER",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 2 or more other characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
