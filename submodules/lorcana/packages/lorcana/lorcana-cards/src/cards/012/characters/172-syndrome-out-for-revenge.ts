import type { CharacterCard } from "@tcg/lorcana-types";
import { syndromeOutForRevengeI18n } from "./172-syndrome-out-for-revenge.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const syndromeOutForRevenge: CharacterCard = {
  id: "wqr",
  canonicalId: "ci_wqr",
  reprints: ["set12-172"],
  cardType: "character",
  name: "Syndrome",
  version: "Out for Revenge",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 172,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_551b17ff6ce94d239237332a2c902086",
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
  i18n: syndromeOutForRevengeI18n,
};
