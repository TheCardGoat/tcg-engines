import type { CharacterCard } from "@tcg/lorcana-types";

export const mamaOdieMysticalMaven: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1gz-1",
      name: "THIS GOING TO BE GOOD",
      text: "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 3,
  externalIds: {
    ravensburger: "bef7418632eb34baeafeaecab51aad74cb7191b3",
  },
  franchise: "Princess and the Frog",
  fullName: "Mama Odie - Mystical Maven",
  id: "1gz",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mama Odie",
  set: "009",
  strength: 1,
  text: "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Mystical Maven",
  willpower: 3,
};
