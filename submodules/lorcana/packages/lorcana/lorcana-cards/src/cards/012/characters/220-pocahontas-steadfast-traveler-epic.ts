import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasSteadfastTravelerEpicI18n } from "./220-pocahontas-steadfast-traveler-epic.i18n";

export const pocahontasSteadfastTravelerEpic: CharacterCard = {
  id: "v2A",
  canonicalId: "ci_iIv",
  slug: "lorcana-ci_iIv",
  printings: [
    {
      id: "set12-220-epic",
      artId: "ci_iIv-epic",
      setCode: "set12",
      collectorNumber: "220",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-171"],
  cardType: "character",
  name: "Pocahontas",
  version: "Steadfast Traveler",
  inkType: ["steel"],
  franchise: "Pocahontas",
  set: "012",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5b512fbc3a31425eb70175752010d69c",
    tcgPlayer: "692215",
  },
  text: [
    {
      title: "WANDERING SPIRIT",
      description:
        "Whenever this character quests, if you played another character this turn, return a location card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "G3i-1",
      name: "WANDERING SPIRIT",
      type: "triggered",
      text: "WANDERING SPIRIT Whenever this character quests, if you played another character this turn, return a location card from your discard to your hand.",
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
          type: "return-from-discard",
          cardType: "location",
          destination: "hand",
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: pocahontasSteadfastTravelerEpicI18n,
};
