import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaAboveItAllI18n } from "./068-yzma-above-it-all.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const yzmaAboveItAll: CharacterCard = {
  id: "JoL",
  canonicalId: "ci_JoL",
  reprints: ["set7-068"],
  cardType: "character",
  name: "Yzma",
  version: "Above It All",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 68,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_181371118d864cd08cfc849f7b795a5d",
    tcgPlayer: 619443,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "BACK TO WORK",
      description:
        "Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
  abilities: [
    shift(5),
    evasive,
    {
      id: "JoL-3",
      name: "BACK TO WORK",
      text: "BACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        on: "OTHER_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              ref: "trigger-source",
            },
          },
          {
            type: "discard",
            amount: 1,
            random: true,
            from: "hand",
            target: "TRIGGER_SOURCE_OWNER",
          },
        ],
      },
    },
  ],
  i18n: yzmaAboveItAllI18n,
};
