import type { CharacterCard } from "@tcg/lorcana-types";
import { christopherRobinAdventurerI18n } from "./002-christopher-robin-adventurer.i18n";

export const christopherRobinAdventurer: CharacterCard = {
  id: "2fz",
  canonicalId: "ci_2fz",
  reprints: ["set2-002"],
  cardType: "character",
  name: "Christopher Robin",
  version: "Adventurer",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 2,
  rarity: "rare",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4730c91483f24305b42abe86b2bb34ee",
    tcgPlayer: 526351,
  },
  text: [
    {
      title: "WE'LL ALWAYS BE TOGETHER",
      description:
        "Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            excludeSelf: true,
          },
          comparison: {
            operator: "gte",
            value: 2,
          },
        },
        then: {
          amount: 2,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "2pm-1",
      name: "WE'LL ALWAYS BE TOGETHER",
      text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: christopherRobinAdventurerI18n,
};
