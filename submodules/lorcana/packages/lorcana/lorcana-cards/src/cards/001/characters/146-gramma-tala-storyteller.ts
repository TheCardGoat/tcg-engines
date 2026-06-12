import type { CharacterCard } from "@tcg/lorcana-types";
import { grammaTalaStorytellerI18n } from "./146-gramma-tala-storyteller.i18n";

export const grammaTalaStoryteller: CharacterCard = {
  id: "ROE",
  canonicalId: "ci_ROE",
  reprints: ["set1-146"],
  cardType: "character",
  name: "Gramma Tala",
  version: "Storyteller",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  cardNumber: 146,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2556ec8a10224e6bb75f2bd54e7a612f",
    tcgPlayer: 508842,
  },
  text: [
    {
      title: "I WILL BE WITH YOU",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      name: "I WILL BE WITH YOU",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "this-card",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "n00-1",
      text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: grammaTalaStorytellerI18n,
};
