import type { CharacterCard } from "@tcg/lorcana-types";
import { belleBeastCertainAsTheSunI18n } from "./132-belle-beast-certain-as-the-sun.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const belleBeastCertainAsTheSun: CharacterCard = {
  id: "kAB",
  canonicalId: "ci_ibA",
  slug: "lorcana-ci_ibA",
  printings: [
    {
      id: "set13-132",
      artId: "set13-132",
      setCode: "set13",
      collectorNumber: "132",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-132"],
  cardType: "character",
  name: "Belle & Beast",
  version: "Certain as the Sun",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 132,
  rarity: "common",
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_063394f93893493ab04808e6d7247926",
  },
  text: [
    {
      title: "Shift 6 {I}",
      description:
        "(You may pay 6 {I} to play this on top of one of your characters named Belle or Beast.)",
    },
    {
      title: "INSPIRING DANCE",
      description: "Whenever this character quests, ready all cards in your inkwell.",
    },
    {
      title: "APPRECIATIVE AUDIENCE 6",
      description: "{I} — Ready your other characters. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Prince", "Princess"],
  abilities: [
    shift("Belle or Beast", 6),
    {
      type: "triggered",
      name: "INSPIRING DANCE",
      text: "INSPIRING DANCE Whenever this character quests, ready all cards in your inkwell.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "ready",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["inkwell"],
        },
      },
    },
    {
      type: "activated",
      name: "APPRECIATIVE AUDIENCE 6",
      text: "APPRECIATIVE AUDIENCE 6 {E} - Ready your other characters. They can't quest for the rest of this turn.",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          },
        ],
      },
    },
  ],
  i18n: belleBeastCertainAsTheSunI18n,
};
