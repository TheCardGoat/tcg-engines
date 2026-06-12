import type { CharacterCard } from "@tcg/lorcana-types";
import { belleSnowfieldStrategistI18n } from "./158-belle-snowfield-strategist.i18n";

export const belleSnowfieldStrategist: CharacterCard = {
  id: "u0b",
  canonicalId: "ci_byy",
  reprints: ["set11-158"],
  cardType: "character",
  name: "Belle",
  version: "Snowfield Strategist",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "011",
  cardNumber: 158,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9652fdf2822645ee91302352c74c9d6a",
    tcgPlayer: 677167,
  },
  text: [
    {
      title: "WINTER STOCKPILE",
      description:
        "Whenever one of your characters is banished, you may put that card from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "psq-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: {
            selector: "all",
            count: 1,
            reference: "trigger-subject",
            zones: ["discard"],
          },
          target: "CONTROLLER",
          type: "put-into-inkwell",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      name: "WINTER STOCKPILE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      type: "triggered",
      text: "WINTER STOCKPILE Whenever one of your characters is banished, you may put that card from your discard into your inkwell facedown and exerted.",
    },
  ],
  i18n: belleSnowfieldStrategistI18n,
};
