import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasSteadfastTravelerI18n } from "./171-pocahontas-steadfast-traveler.i18n";

export const pocahontasSteadfastTraveler: CharacterCard = {
  id: "5Da",
  canonicalId: "ci_5Da",
  reprints: ["set12-171"],
  cardType: "character",
  name: "Pocahontas",
  version: "Steadfast Traveler",
  inkType: ["steel"],
  franchise: "Pocahontas",
  set: "012",
  cardNumber: 171,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_65471535e336408d9a1f465798307df2",
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
  i18n: pocahontasSteadfastTravelerI18n,
};
