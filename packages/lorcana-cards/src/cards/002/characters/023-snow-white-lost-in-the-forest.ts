import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteLostInTheForest: CharacterCard = {
  id: "muw",
  cardType: "character",
  name: "Snow White",
  version: "Lost in the Forest",
  fullName: "Snow White - Lost in the Forest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52625a3814824139f2171b5ae5029653a9b48d92",
  },
  abilities: [
    {
      id: "muw-1",
      type: "triggered",
      name: "I WON'T HURT YOU",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
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
      text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
