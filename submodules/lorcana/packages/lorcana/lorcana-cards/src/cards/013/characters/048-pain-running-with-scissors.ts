import type { CharacterCard } from "@tcg/lorcana-types";
import { painRunningWithScissorsI18n } from "./048-pain-running-with-scissors.i18n";

export const painRunningWithScissors: CharacterCard = {
  id: "kJR",
  canonicalId: "ci_kJR",
  slug: "lorcana-ci_kJR",
  printings: [
    {
      id: "set13-048",
      artId: "set13-048",
      setCode: "set13",
      collectorNumber: "48",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-048"],
  cardType: "character",
  name: "Pain",
  version: "Running with Scissors",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 48,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5cd9936e32dc4b1bb6640e0b6e7c9aac",
  },
  text: [
    {
      title: "MULTIPURPOSE TOOL",
      description:
        "When you play this character, if you have a character card named Panic in your discard, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "kJR-1",
      name: "MULTIPURPOSE TOOL",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
          filters: [
            {
              type: "name",
              equals: "Panic",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "MULTIPURPOSE TOOL When you play this character, if you have a character card named Panic in your discard, gain 2 lore.",
    },
  ],
  i18n: painRunningWithScissorsI18n,
};
