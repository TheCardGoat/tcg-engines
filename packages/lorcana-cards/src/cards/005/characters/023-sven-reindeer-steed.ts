import type { CharacterCard } from "@tcg/lorcana-types";

export const svenReindeerSteed: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "SELF",
          duration: "this-turn",
        },
        type: "optional",
      },
      id: "m3t-1",
      name: "REINDEER GAMES",
      text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "4fac01ae24ed46541c989cd4724efec55c02a694",
  },
  franchise: "Frozen",
  fullName: "Sven - Reindeer Steed",
  id: "m3t",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Sven",
  set: "005",
  strength: 3,
  text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
  version: "Reindeer Steed",
  willpower: 3,
};
