import type { CharacterCard } from "@tcg/lorcana-types";
import { pongoDearOldDadI18n } from "./029-pongo-dear-old-dad.i18n";

export const pongoDearOldDad: CharacterCard = {
  id: "eBt",
  canonicalId: "ci_eBt",
  reprints: ["set7-029"],
  cardType: "character",
  name: "Pongo",
  version: "Dear Old Dad",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 29,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9fbbf95f7db645ad87d4e78d12a05a96",
    tcgPlayer: 619422,
  },
  text: [
    {
      title: "FOUND YOU, YOU LITTLE RASCAL",
      description:
        "At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "lmd-1",
      name: "FOUND YOU, YOU LITTLE RASCAL",
      text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-inkwell",
            target: "CONTROLLER",
          },
          {
            chooser: "CONTROLLER",
            type: "optional",
            effect: {
              type: "play-card",
              from: "inkwell",
              cost: "free",
              cardType: "character",
              filter: {
                classification: "Puppy",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: pongoDearOldDadI18n,
};
