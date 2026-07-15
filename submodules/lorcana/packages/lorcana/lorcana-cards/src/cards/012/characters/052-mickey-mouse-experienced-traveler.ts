import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseExperiencedTravelerI18n } from "./052-mickey-mouse-experienced-traveler.i18n";

export const mickeyMouseExperiencedTraveler: CharacterCard = {
  id: "kb3",
  canonicalId: "ci_kb3",
  slug: "lorcana-ci_kb3",
  printings: [
    {
      id: "set12-052",
      artId: "set12-052",
      setCode: "set12",
      collectorNumber: "52",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-052"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Experienced Traveler",
  inkType: ["amethyst"],
  set: "012",
  cardNumber: 52,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_8bcdf654443a405caac520c31100c7da",
    tcgPlayer: "692233",
  },
  text: [
    {
      title: "LIGHTING THE WAY",
      description:
        "Whenever this character quests, if you played another character this turn, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  abilities: [
    {
      id: "kb3-1",
      name: "Lighting the Way",
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
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: mickeyMouseExperiencedTravelerI18n,
};
