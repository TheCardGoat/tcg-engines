import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckDistractedTravelerEpicI18n } from "./212-donald-duck-distracted-traveler-epic.i18n";

export const donaldDuckDistractedTravelerEpic: CharacterCard = {
  id: "gbh",
  canonicalId: "ci_QXV",
  slug: "lorcana-ci_QXV",
  printings: [
    {
      id: "set12-212-epic",
      artId: "ci_QXV-epic",
      setCode: "set12",
      collectorNumber: "212",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-084"],
  cardType: "character",
  name: "Donald Duck",
  version: "Distracted Traveler",
  inkType: ["emerald"],
  set: "012",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5186a8ffa2ac448c9108a110b747e4e5",
    tcgPlayer: "692209",
  },
  text: [
    {
      title: "BURNING CURIOSITY",
      description:
        "Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "QXV-1",
      name: "BURNING CURIOSITY",
      type: "triggered",
      text: "BURNING CURIOSITY Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.",
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
        type: "discard",
        amount: 1,
        chosen: true,
        from: "hand",
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: donaldDuckDistractedTravelerEpicI18n,
};
