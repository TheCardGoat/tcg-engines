import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyJungleGuideP3ChallengeI18n } from "./p3-054-woody-jungle-guide-challenge.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const woodyJungleGuideP3Challenge: CharacterCard = {
  id: "6Vg",
  canonicalId: "ci_1z1",
  slug: "lorcana-ci_1z1",
  printings: [
    {
      id: "set12-p3-054-challenge",
      artId: "ci_1z1-challenge",
      setCode: "set12",
      collectorNumber: "54",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set12-015"],
  cardType: "character",
  name: "Woody",
  version: "Jungle Guide",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 54,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_23f90c492e514c569e969d30089ba8cf",
    tcgPlayer: "690203",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "LET'S GET MOVIN'",
      description:
        "Whenever this character quests, draw a card. Then, you may play a character with cost 2 or less for free.",
    },
    {
      title: "EVERYONE GATHER 'ROUND",
      description: "Your other Toy characters get +1 {W}.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Toy"],
  abilities: [
    shift(3),
    {
      id: "1z1-2",
      name: "LET'S GET MOVIN'",
      type: "triggered",
      text: "LET'S GET MOVIN' Whenever this character quests, draw a card. Then, you may play a character with cost 2 or less for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "play-card",
              cardType: "character",
              cost: "free",
              costRestriction: {
                comparison: "less-or-equal",
                value: 2,
              },
              from: "hand",
            },
          },
        ],
      },
    },
    {
      id: "1z1-3",
      name: "EVERYONE GATHER 'ROUND",
      type: "static",
      text: "EVERYONE GATHER 'ROUND Your other Toy characters get +1 {W}.",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Toy",
            },
          ],
          excludeSelf: true,
        },
      },
    },
  ],
  i18n: woodyJungleGuideP3ChallengeI18n,
};
