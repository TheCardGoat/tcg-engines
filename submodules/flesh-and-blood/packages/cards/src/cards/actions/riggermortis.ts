import { wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/riggermortis.generated.ts";

export const riggermortis = definePitchFamily(fabPitchFamilies["riggermortis"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const { yellow: riggermortisYellow } = riggermortis.cards;
