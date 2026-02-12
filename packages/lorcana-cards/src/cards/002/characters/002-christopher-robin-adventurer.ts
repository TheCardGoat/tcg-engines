import type { CharacterCard } from "@tcg/lorcana-types";

export const christopherRobinAdventurer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have 2 or more other characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        type: "conditional",
      },
      id: "2pm-1",
      name: "WE'LL ALWAYS BE TOGETHER",
      text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "09c622f4623326886425e229b1bd88910dc489bc",
  },
  franchise: "Winnie the Pooh",
  fullName: "Christopher Robin - Adventurer",
  id: "2pm",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Christopher Robin",
  set: "002",
  strength: 2,
  text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
  version: "Adventurer",
  willpower: 6,
};
