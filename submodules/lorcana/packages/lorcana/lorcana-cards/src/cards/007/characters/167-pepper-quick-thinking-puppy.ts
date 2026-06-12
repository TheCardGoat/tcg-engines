import type { CharacterCard } from "@tcg/lorcana-types";
import { pepperQuickthinkingPuppyI18n } from "./167-pepper-quick-thinking-puppy.i18n";

export const pepperQuickthinkingPuppy: CharacterCard = {
  id: "C36",
  canonicalId: "ci_C36",
  reprints: ["set7-167"],
  cardType: "character",
  name: "Pepper",
  version: "Quick-Thinking Puppy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 167,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_eddf6a4eb7af4098997b5e91e4a763e7",
    tcgPlayer: 618249,
  },
  text: [
    {
      title: "IN THE NICK OF TIME",
      description:
        "Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: { reference: "trigger-subject" },
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "15w-1",
      name: "IN THE NICK OF TIME",
      text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Puppy",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: pepperQuickthinkingPuppyI18n,
};
