import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fuel-injector.generated.ts";

export const fuelInjector = definePitchFamily(fabPitchFamilies["fuel-injector"], {
  abilities: () => ({
    instantPutBottomOwnerSDeckGain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "move-to-deck",
        from: "self",
        position: "bottom",
        count: 1,
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  }),
});
export const { blue: fuelInjectorBlue } = fuelInjector.cards;
