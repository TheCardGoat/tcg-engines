import type { CharacterCard } from "@tcg/lorcana-types";

export const svenReindeerSteed: CharacterCard = {
  id: "m3t",
  cardType: "character",
  name: "Sven",
  version: "Reindeer Steed",
  fullName: "Sven - Reindeer Steed",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 23,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fac01ae24ed46541c989cd4724efec55c02a694",
  },
  abilities: [
    {
      id: "m3t-1",
      type: "triggered",
      name: "REINDEER GAMES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "SELF",
          duration: "this-turn",
        },
        chooser: "CONTROLLER",
      },
      text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
