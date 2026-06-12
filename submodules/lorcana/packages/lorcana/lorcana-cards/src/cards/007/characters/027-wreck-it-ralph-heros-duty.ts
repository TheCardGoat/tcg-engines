import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphHerosDutyI18n } from "./027-wreck-it-ralph-heros-duty.i18n";

export const wreckitRalphHerosDuty: CharacterCard = {
  id: "16Q",
  canonicalId: "ci_16Q",
  reprints: ["set7-027"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Hero's Duty",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 27,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_98cc1ff61f704e70a88362de3d5d29a7",
    tcgPlayer: 619421,
  },
  text: [
    {
      title: "OUTFLANK",
      description:
        "During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1p2-1",
      name: "OUTFLANK",
      text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphHerosDutyI18n,
};
