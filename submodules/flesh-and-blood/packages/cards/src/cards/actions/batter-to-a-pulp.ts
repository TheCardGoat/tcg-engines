import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/batter-to-a-pulp.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const batterToAPulp = definePitchFamily(fabPitchFamilies["batter-to-a-pulp"], {
  abilities: () => ({
    ifWouldDeal4MoreDamageDamageCanT: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "be-prevented",
        subject: {
          selector: "self",
        },
        duration: "this-chain-link",
      },
    },
    crushDestroyEquipmentWithoutDefense: crushAbility({
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
            lacksProperty: "defense",
          },
          count: 1,
        },
      },
    }),
  }),
});
export const { red: batterToAPulpRed } = batterToAPulp.cards;
