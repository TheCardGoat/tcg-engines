import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyDeterminedTravelerI18n } from "./189-goofy-determined-traveler.i18n";

export const goofyDeterminedTraveler: CharacterCard = {
  id: "MeR",
  canonicalId: "ci_MeR",
  slug: "lorcana-ci_MeR",
  printings: [
    {
      id: "set12-189",
      artId: "set12-189",
      setCode: "set12",
      collectorNumber: "189",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-189"],
  cardType: "character",
  name: "Goofy",
  version: "Determined Traveler",
  inkType: ["steel"],
  set: "012",
  cardNumber: 189,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_72faf592ef64418b856f80140e0ac6be",
    tcgPlayer: "692199",
  },
  text: [
    {
      title: "FALLING ROCKS",
      description:
        "Whenever this character quests, if you played another character this turn, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "MeR-1",
      name: "FALLING ROCKS",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        excludeSource: true,
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
        },
      },
    },
  ],
  i18n: goofyDeterminedTravelerI18n,
};
