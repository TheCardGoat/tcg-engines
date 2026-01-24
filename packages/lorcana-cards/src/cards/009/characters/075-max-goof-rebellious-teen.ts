import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofRebelliousTeen: CharacterCard = {
  id: "1va",
  cardType: "character",
  name: "Max Goof",
  version: "Rebellious Teen",
  fullName: "Max Goof - Rebellious Teen",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f281bb60772f0650742a5f075ff156ba1d177e8b",
  },
  abilities: [
    {
      id: "1va-1",
      type: "triggered",
      name: "PERSONAL SOUNDTRACK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
