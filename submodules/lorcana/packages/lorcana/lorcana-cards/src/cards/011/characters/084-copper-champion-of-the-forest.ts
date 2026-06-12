import type { CharacterCard } from "@tcg/lorcana-types";
import { copperChampionOfTheForestI18n } from "./084-copper-champion-of-the-forest.i18n";

export const copperChampionOfTheForest: CharacterCard = {
  id: "dzM",
  canonicalId: "ci_dzM",
  reprints: ["set11-084"],
  cardType: "character",
  name: "Copper",
  version: "Champion of the Forest",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 84,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1828e2a9c3c547abbcd95f8c4fdc211f",
    tcgPlayer: 676202,
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "MORE TO EXPLORE",
      description:
        "Whenever this character quests, your characters with Evasive get +1 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      id: "11t-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "11t-2",
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_EVASIVE_CHARACTERS",
        type: "modify-stat",
        duration: "this-turn",
      },
      name: "MORE TO EXPLORE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "MORE TO EXPLORE Whenever this character quests, your characters with Evasive get +1 {L} this turn.",
    },
  ],
  i18n: copperChampionOfTheForestI18n,
};
