import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { merlinCompletingHisResearchI18n } from "./058-merlin-completing-his-research.i18n";

export const merlinCompletingHisResearch: CharacterCard = {
  id: "JaP",
  canonicalId: "ci_Vvr",
  reprints: ["set10-058"],
  cardType: "character",
  name: "Merlin",
  version: "Completing His Research",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  cardNumber: 58,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d51cdd2a1d904e03adb5e255a2b53a22",
    tcgPlayer: 660189,
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
  i18n: merlinCompletingHisResearchI18n,
};
