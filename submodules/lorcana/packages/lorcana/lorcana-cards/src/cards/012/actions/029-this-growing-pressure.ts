import type { ActionCard } from "@tcg/lorcana-types";
import { thisGrowingPressureI18n } from "./029-this-growing-pressure.i18n";

export const thisGrowingPressure: ActionCard = {
  id: "JWU",
  canonicalId: "ci_JWU",
  reprints: ["set12-029"],
  cardType: "action",
  name: "This Growing Pressure",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 29,
  rarity: "common",
  cost: 3,
  inkable: true,

  externalIds: {
    lorcast: "crd_aef0af5d54a84b1dadfd6351fbec3a01",
  },
  text: "Chosen opposing character can't challenge and must quest during their next turn if able. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen opposing character can't challenge and must quest during their next turn if able. Draw a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "their-next-turn",
          },
          {
            type: "restriction",
            restriction: "must-quest",
            target: {
              ref: "previous-target",
            },
            duration: "their-next-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: thisGrowingPressureI18n,
};
