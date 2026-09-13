import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { grantOnHitToTargetAttack } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/slice-up.generated.ts";

export const sliceUp = definePitchFamily(fabPitchFamilies["slice-up"], {
  abilities: () => ({
    rider: grantOnHitToTargetAttack({
      filter: { typeBox: { types: ["Weapon"] } },
      effect: {
        type: "optional",
        effect: {
          type: "remove-counters",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: 1,
          target: { selector: "self" },
        },
        then: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    }),
  }),
});
export const { red: sliceUpRed } = sliceUp.cards;
