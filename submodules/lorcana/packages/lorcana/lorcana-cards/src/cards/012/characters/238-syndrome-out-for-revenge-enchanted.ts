import type { CharacterCard } from "@tcg/lorcana-types";
import { syndromeOutForRevengeEnchantedI18n } from "./238-syndrome-out-for-revenge-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const syndromeOutForRevengeEnchanted: CharacterCard = {
  id: "dtA",
  canonicalId: "ci_wqr",
  slug: "lorcana-ci_wqr",
  printings: [
    {
      id: "set12-238-enchanted",
      artId: "ci_wqr-enchanted",
      setCode: "set12",
      collectorNumber: "238",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-172"],
  cardType: "character",
  name: "Syndrome",
  version: "Out for Revenge",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 238,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ca85bb2c2274683bb7f2015997479c5",
    tcgPlayer: "692228",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "GOT ME MONOLOGUING!",
      description:
        "Whenever this character quests, return a Robot character card from your discard to your hand. Then, you may play or shift a Robot character with cost 8 or less for free.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Villain", "Inventor"],
  abilities: [
    shift(4),
    {
      id: "wqr-2",
      name: "GOT ME MONOLOGUING!",
      type: "triggered",
      text: "GOT ME MONOLOGUING! Whenever this character quests, return a Robot character card from your discard to your hand. Then, you may play or shift a Robot character with cost 8 or less for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-from-discard",
            target: "CONTROLLER",
            count: 1,
            cardType: "character",
            filter: [
              {
                type: "has-classification",
                classification: "Robot",
              },
            ],
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
                value: 8,
              },
              from: "hand",
              playMethod: "either",
              filter: [
                {
                  type: "has-classification",
                  classification: "Robot",
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: syndromeOutForRevengeEnchantedI18n,
};
