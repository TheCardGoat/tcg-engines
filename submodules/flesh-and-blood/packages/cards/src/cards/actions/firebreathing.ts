import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/firebreathing.generated.ts";

export const firebreathing = definePitchFamily(fabPitchFamilies["firebreathing"], {
  abilities: () => ({
    instantFirebreathingGains1ActivateAbilityOnlyWhileFirebreathing: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      condition: {
        type: "has-status",
        status: "attacking",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: firebreathingRed } = firebreathing.cards;
