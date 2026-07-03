import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasSteadfastTravelerP3PromoI18n } from "./p3-048-pocahontas-steadfast-traveler-promo.i18n";

export const pocahontasSteadfastTravelerP3Promo: CharacterCard = {
  id: "Zxd",
  canonicalId: "ci_iIv",
  slug: "lorcana-ci_iIv",
  printings: [
    {
      id: "set12-p3-048-promo",
      artId: "ci_iIv-promo",
      setCode: "set12",
      collectorNumber: "48",
      rarity: "promo",
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
  cardNumber: 48,
  rarity: "special",
  specialRarity: "promo",
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
  i18n: pocahontasSteadfastTravelerP3PromoI18n,
};
