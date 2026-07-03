import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePracticalTravelerEpicI18n } from "./219-minnie-mouse-practical-traveler-epic.i18n";

export const minnieMousePracticalTravelerEpic: CharacterCard = {
  id: "5A7",
  canonicalId: "ci_uSb",
  slug: "lorcana-ci_uSb",
  printings: [
    {
      id: "set12-219-epic",
      artId: "ci_uSb-epic",
      setCode: "set12",
      collectorNumber: "219",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-159"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Practical Traveler",
  inkType: ["sapphire"],
  set: "012",
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c3586bda90744abf8eb5c15db3b0b766",
    tcgPlayer: "692214",
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
  i18n: minnieMousePracticalTravelerEpicI18n,
};
