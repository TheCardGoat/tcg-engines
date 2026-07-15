import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelFlynnRiderUnlikelyPairI18n } from "./100-rapunzel-flynn-rider-unlikely-pair.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const rapunzelFlynnRiderUnlikelyPair: CharacterCard = {
  id: "xno",
  canonicalId: "ci_xno",
  slug: "lorcana-ci_xno",
  printings: [
    {
      id: "set13-100",
      artId: "set13-100",
      setCode: "set13",
      collectorNumber: "100",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-100"],
  cardType: "character",
  name: "Rapunzel & Flynn Rider",
  version: "Unlikely Pair",
  inkType: ["emerald", "steel"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 100,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_96c13d549e86443982376fd82092e179",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "CLEVER SWAP",
      description:
        "Whenever this character quests, you may draw a card, then choose and discard a card.",
    },
    {
      title: "FRESH START",
      description:
        "During your turn, whenever you discard a character card, you may play that character from your discard. (You pay all costs.)",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Prince", "Princess"],
  abilities: [
    shift("Rapunzel or Flynn Rider", 3),
    {
      type: "triggered",
      name: "CLEVER SWAP",
      text: "CLEVER SWAP Whenever this character quests, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
            },
          ],
        },
      },
    },
    {
      type: "triggered",
      name: "FRESH START",
      text: "FRESH START During your turn, whenever you discard a character card, you may play that character from your discard. (You pay all costs.)",
      trigger: {
        event: "discard",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "discard",
          cardType: "character",
          filter: {
            cardType: "character",
            sameInstanceAsTriggerSubject: true,
          },
        },
      },
    },
  ],
  i18n: rapunzelFlynnRiderUnlikelyPairI18n,
};
