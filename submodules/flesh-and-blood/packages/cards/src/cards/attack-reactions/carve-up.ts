import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { grantOnHitToTargetAttack } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/carve-up.generated.ts";

export const carveUp = definePitchFamily(fabPitchFamilies["carve-up"], {
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
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["arsenal"],
            count: 1,
          },
        },
      },
    }),
  }),
});
export const { yellow: carveUpYellow } = carveUp.cards;
