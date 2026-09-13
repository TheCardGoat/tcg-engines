import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mangle.generated.ts";

export const mangle = definePitchFamily(fabPitchFamilies["mangle"], {
  abilities: () => ({
    deals4MoreDamageDestroyTargetEquipment1DefenseCounter: crushAbility({
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
            hasCounter: "-1{d}",
          },
          count: 1,
        },
      },
    }),
  }),
});

export const { red: mangleRed } = mangle.cards;
