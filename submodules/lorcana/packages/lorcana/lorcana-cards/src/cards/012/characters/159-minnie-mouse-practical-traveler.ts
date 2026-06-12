import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePracticalTravelerI18n } from "./159-minnie-mouse-practical-traveler.i18n";

export const minnieMousePracticalTraveler: CharacterCard = {
  id: "uSb",
  canonicalId: "ci_uSb",
  reprints: ["set12-159"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Practical Traveler",
  inkType: ["sapphire"],
  set: "012",
  cardNumber: 159,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b760305650e54e7b84dcbeb7c014b0f5",
  },
  text: [
    {
      title: "DISCERNING EYE",
      description:
        "Whenever this character quests, if you played another character this turn, gain 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "uSb-1",
      name: "DISCERNING EYE",
      type: "triggered",
      text: "DISCERNING EYE Whenever this character quests, if you played another character this turn, gain 1 lore.",
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
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: minnieMousePracticalTravelerI18n,
};
