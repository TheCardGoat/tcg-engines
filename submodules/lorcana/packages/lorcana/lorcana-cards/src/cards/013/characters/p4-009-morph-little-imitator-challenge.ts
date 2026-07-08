import type { CharacterCard } from "@tcg/lorcana-types";
import { morphLittleImitatorP4ChallengeI18n } from "./p4-009-morph-little-imitator-challenge.i18n";

export const morphLittleImitatorP4Challenge: CharacterCard = {
  id: "q7p",
  canonicalId: "ci_yd8",
  slug: "lorcana-ci_yd8",
  printings: [
    {
      id: "set13-p4-009-challenge",
      artId: "ci_yd8-challenge",
      setCode: "set13",
      collectorNumber: "9",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set13-057"],
  cardType: "character",
  name: "Morph",
  version: "Little Imitator",
  inkType: ["amethyst"],
  franchise: "Treasure Planet",
  set: "013",
  cardNumber: 9,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1d11c04c567842fd981951674665889a",
  },
  text: [
    {
      title: "ADVANCED MIMICRY",
      description:
        "You can shift any character on top of this character. (This includes all Shift variants.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [
    {
      id: "yd8-1",
      name: "ADVANCED MIMICRY",
      type: "static",
      text: "ADVANCED MIMICRY You can shift any character on top of this character.",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
    },
  ],
  i18n: morphLittleImitatorP4ChallengeI18n,
};
