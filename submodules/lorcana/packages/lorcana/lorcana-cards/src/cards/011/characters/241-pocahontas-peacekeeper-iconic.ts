import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasPeacekeeperIconicI18n } from "./241-pocahontas-peacekeeper-iconic.i18n";

export const pocahontasPeacekeeperIconic: CharacterCard = {
  id: "dB0",
  canonicalId: "ci_4DB",
  slug: "lorcana-ci_4DB",
  printings: [
    {
      id: "set11-241-iconic",
      artId: "ci_4DB-iconic",
      setCode: "set11",
      collectorNumber: "241",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-022"],
  cardType: "character",
  name: "Pocahontas",
  version: "Peacekeeper",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 241,
  rarity: "common",
  specialRarity: "iconic",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_40a3f6d8de604ff085fa5629597780a3",
    tcgPlayer: "673298",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "CALMING WORDS",
      description:
        "When you play this character, if you used Shift to play her and none of your characters challenged this turn, characters can't challenge until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    {
      id: "sbm-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "sbm-2",
      effect: {
        condition: {
          type: "and",
          conditions: [
            {
              type: "used-shift",
            },
            {
              type: "turn-metric",
              metric: "challenges-by-player",
              comparison: {
                operator: "eq",
                value: 0,
              },
              playerScope: "you",
            },
          ],
        },
        then: {
          duration: "until-start-of-next-turn",
          restriction: "cant-challenge",
          target: "ALL_CHARACTERS",
          type: "restriction",
        },
        type: "conditional",
      },
      name: "CALMING WORDS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CALMING WORDS When you play this character, if you used Shift to play her and none of your characters challenged this turn, characters can't challenge until the start of your next turn.",
    },
  ],
  i18n: pocahontasPeacekeeperIconicI18n,
};
