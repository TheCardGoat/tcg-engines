import type { CharacterCard } from "@tcg/lorcana-types";
import { chichaDedicatedMotherP2ChallengeI18n } from "./p2-005-chicha-dedicated-mother-challenge.i18n";

import { support } from "../../../helpers/abilities/support";

export const chichaDedicatedMotherP2Challenge: CharacterCard = {
  id: "hUP",
  canonicalId: "ci_4rT",
  slug: "lorcana-ci_4rT",
  printings: [
    {
      id: "set5-p2-005-challenge",
      artId: "ci_4rT-challenge",
      setCode: "set5",
      collectorNumber: "5",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-146"],
  cardType: "character",
  name: "Chicha",
  version: "Dedicated Mother",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 5,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_775c901d8b4d4fd3884750a11cb7b1be",
    tcgPlayer: "561998",
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "ONE ON THE WAY",
      description:
        "During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    support,
    {
      id: "q5f-2",
      effect: {
        condition: {
          type: "turn-metric",
          metric: "cards-inked",
          comparison: {
            operator: "eq",
            value: 2,
          },
        },
        then: {
          chooser: "CONTROLLER",
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          type: "optional",
        },
        type: "conditional",
      },
      name: "ONE ON THE WAY",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      type: "triggered",
      text: "ONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
    },
  ],
  i18n: chichaDedicatedMotherP2ChallengeI18n,
};
