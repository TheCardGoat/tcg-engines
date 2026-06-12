import type { ItemCard } from "@tcg/lorcana-types";
import { medallionWeightsI18n } from "./132-medallion-weights.i18n";

export const medallionWeights: ItemCard = {
  id: "Tcn",
  canonicalId: "ci_BIF",
  reprints: ["set4-132", "set9-134"],
  cardType: "item",
  name: "Medallion Weights",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 132,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_568ccd26d0fa49ac94a67b49e599930d",
    tcgPlayer: 650069,
  },
  text: [
    {
      title: "DISCIPLINE AND STRENGTH",
      description:
        "{E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
    },
  ],
  abilities: [
    {
      id: "1rm-1",
      name: "DISCIPLINE AND STRENGTH",
      text: "{E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "grant-ability",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
            ability: {
              id: "draw-when-challenging",
              type: "triggered",
              text: "Whenever this character challenges another character this turn, you may draw a card.",
              trigger: {
                event: "challenge",
                timing: "whenever",
                on: "SELF",
                defender: {
                  controller: "opponent",
                },
              },
              effect: {
                type: "optional",
                chooser: "CONTROLLER",
                effect: {
                  type: "draw",
                  amount: 1,
                  target: "CONTROLLER",
                },
              },
            },
          },
        ],
      },
    },
  ],
  i18n: medallionWeightsI18n,
};
