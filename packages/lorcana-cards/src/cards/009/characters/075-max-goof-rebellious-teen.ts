import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofRebelliousTeen: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1va-1",
      name: "PERSONAL SOUNDTRACK",
      text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "f281bb60772f0650742a5f075ff156ba1d177e8b",
  },
  franchise: "Goofy Movie",
  fullName: "Max Goof - Rebellious Teen",
  id: "1va",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Max Goof",
  set: "009",
  strength: 2,
  text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
  version: "Rebellious Teen",
  willpower: 2,
};
