import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/calming-breeze.generated.ts";

export const calmingBreeze = definePitchFamily(fabPitchFamilies["calming-breeze"], {
  abilities: () => ({
    next3TimesWouldBeDealtDamageTurnPrevent: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        times: 3,
      },
    },
  }),
});

export const { red: calmingBreezeRed } = calmingBreeze.cards;
