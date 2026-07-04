import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckSleepwalkerI18n } from "./083-donald-duck-sleepwalker.i18n";

export const donaldDuckSleepwalker: CharacterCard = {
  id: "JNo",
  canonicalId: "ci_P3k",
  slug: "lorcana-ci_P3k",
  printings: [
    {
      id: "set9-083",
      artId: "set9-083",
      setCode: "set9",
      collectorNumber: "83",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-078", "set9-083"],
  cardType: "character",
  name: "Donald Duck",
  version: "Sleepwalker",
  inkType: ["emerald"],
  set: "009",
  cardNumber: 83,
  rarity: "common",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a93802d7a13a4535acb8c9a6bc31dfc2",
    tcgPlayer: "650023",
  },
  text: [
    {
      title: "STARTLED AWAKE",
      description: "Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1nl-1",
      name: "STARTLED AWAKE",
      text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckSleepwalkerI18n,
};
