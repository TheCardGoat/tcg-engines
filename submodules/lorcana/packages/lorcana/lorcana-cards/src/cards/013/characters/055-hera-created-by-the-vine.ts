import type { CharacterCard } from "@tcg/lorcana-types";
import { heraCreatedByTheVineI18n } from "./055-hera-created-by-the-vine.i18n";

export const heraCreatedByTheVine: CharacterCard = {
  id: "TBN",
  canonicalId: "ci_TBN",
  slug: "lorcana-ci_TBN",
  printings: [
    {
      id: "set13-055",
      artId: "set13-055",
      setCode: "set13",
      collectorNumber: "55",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-055"],
  cardType: "character",
  name: "Hera",
  version: "Created by the Vine",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 55,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_03f9ebc033fb4cff9ba721b38b6681a8",
  },
  text: [
    {
      title: "MYSTICAL BOON",
      description: "Whenever you play this or another Floodborn character, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Queen", "Deity", "Vineling"],
  abilities: [
    {
      id: "TBN-1-self",
      name: "MYSTICAL BOON",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "MYSTICAL BOON Whenever you play this or another Floodborn character, gain 1 lore.",
    },
    {
      id: "TBN-1",
      name: "MYSTICAL BOON",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "MYSTICAL BOON Whenever you play this or another Floodborn character, gain 1 lore.",
    },
  ],
  i18n: heraCreatedByTheVineI18n,
};
