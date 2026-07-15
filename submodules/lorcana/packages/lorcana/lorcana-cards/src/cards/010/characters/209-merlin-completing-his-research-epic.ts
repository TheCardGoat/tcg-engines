import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinCompletingHisResearchEpicI18n } from "./209-merlin-completing-his-research-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const merlinCompletingHisResearchEpic: CharacterCard = {
  id: "xoA",
  canonicalId: "ci_Vvr",
  slug: "lorcana-ci_Vvr",
  printings: [
    {
      id: "set10-209-epic",
      artId: "ci_Vvr-epic",
      setCode: "set10",
      collectorNumber: "209",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-058"],
  cardType: "character",
  name: "Merlin",
  version: "Completing His Research",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  cardNumber: 209,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d51cdd2a1d904e03adb5e255a2b53a22",
    tcgPlayer: "660189",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "LEGACY OF LEARNING",
      description:
        "When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "mr7-2",
      name: "LEGACY OF LEARNING",
      text: "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      condition: {
        type: "trigger-subject-had-card-under",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: merlinCompletingHisResearchEpicI18n,
};
