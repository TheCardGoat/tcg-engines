import type { CharacterCard } from "@tcg/lorcana-types";

export const mamaOdieMysticalMaven: CharacterCard = {
  id: "1gz",
  cardType: "character",
  name: "Mama Odie",
  version: "Mystical Maven",
  fullName: "Mama Odie - Mystical Maven",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "009",
  text: "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 152,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "bef7418632eb34baeafeaecab51aad74cb7191b3",
  },
  abilities: [
    {
      id: "1gz-1",
      type: "triggered",
      name: "THIS GOING TO BE GOOD",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
