import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMonstrousDragon: CharacterCard = {
  id: "19f",
  cardType: "character",
  name: "Maleficent",
  version: "Monstrous Dragon",
  fullName: "Maleficent - Monstrous Dragon",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "DRAGON FIRE When you play this character, you may banish chosen character.",
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  cardNumber: 108,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a3c5b9ffeb759ea92fe07213aadc27902cf0ddbf",
  },
  abilities: [
    {
      id: "19f-1",
      type: "triggered",
      name: "DRAGON FIRE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "DRAGON FIRE When you play this character, you may banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Dragon"],
};
