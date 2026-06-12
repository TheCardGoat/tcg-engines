import type { CharacterCard } from "@tcg/lorcana-types";
import { mamaOdieMysticalMavenI18n } from "./151-mama-odie-mystical-maven.i18n";

export const mamaOdieMysticalMaven: CharacterCard = {
  id: "0qj",
  canonicalId: "ci_Ul4",
  reprints: ["set3-151", "set9-152"],
  cardType: "character",
  name: "Mama Odie",
  version: "Mystical Maven",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "003",
  cardNumber: 151,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_901fa7746b2745bc84aa4c7c6fddbbc7",
    tcgPlayer: 650087,
  },
  text: [
    {
      title: "THIS GOING TO BE GOOD",
      description:
        "Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
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
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mamaOdieMysticalMavenI18n,
};
