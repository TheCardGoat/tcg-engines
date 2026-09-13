import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blasmophet-s-boon.generated.ts";

export const blasmophetSBoon = definePitchFamily(fabPitchFamilies["blasmophet-s-boon"], {
  keywords: [bloodDebt],
  abilities: () => ({
    powerIfYouControlBlasmophet: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "conditional",
        condition: {
          type: "control-object",
          filter: { nameContains: "Blasmophet", typeBox: { excludeTypes: ["Action"] } },
        },
        then: 6,
        else: 0,
      },
    },
  }),
});

export const { blue: blasmophetSBoonBlue } = blasmophetSBoon.cards;
