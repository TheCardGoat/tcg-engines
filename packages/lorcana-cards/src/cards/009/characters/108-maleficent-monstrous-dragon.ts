import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMonstrousDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "19f-1",
      name: "DRAGON FIRE",
      text: "DRAGON FIRE When you play this character, you may banish chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 108,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Dragon"],
  cost: 9,
  externalIds: {
    ravensburger: "a3c5b9ffeb759ea92fe07213aadc27902cf0ddbf",
  },
  franchise: "Sleeping Beauty",
  fullName: "Maleficent - Monstrous Dragon",
  id: "19f",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maleficent",
  set: "009",
  strength: 7,
  text: "DRAGON FIRE When you play this character, you may banish chosen character.",
  version: "Monstrous Dragon",
  willpower: 5,
};
