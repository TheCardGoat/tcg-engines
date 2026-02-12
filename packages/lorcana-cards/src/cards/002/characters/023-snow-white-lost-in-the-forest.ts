import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteLostInTheForest: CharacterCard = {
  abilities: [
    {
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
      id: "muw-1",
      name: "I WON'T HURT YOU",
      text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 2,
  externalIds: {
    ravensburger: "52625a3814824139f2171b5ae5029653a9b48d92",
  },
  franchise: "Snow White",
  fullName: "Snow White - Lost in the Forest",
  id: "muw",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Snow White",
  set: "002",
  strength: 2,
  text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
  version: "Lost in the Forest",
  willpower: 3,
};
