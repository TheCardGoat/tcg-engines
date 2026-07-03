import type { CharacterCard } from "@tcg/lorcana-types";
import { morphLittleImitatorI18n } from "./057-morph-little-imitator.i18n";

export const morphLittleImitator: CharacterCard = {
  id: "yd8",
  canonicalId: "ci_yd8",
  slug: "lorcana-ci_yd8",
  printings: [
    {
      id: "set13-057",
      artId: "set13-057",
      setCode: "set13",
      collectorNumber: "57",
      rarity: "uncommon",
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
  cardNumber: 57,
  rarity: "uncommon",
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
  i18n: morphLittleImitatorI18n,
};
