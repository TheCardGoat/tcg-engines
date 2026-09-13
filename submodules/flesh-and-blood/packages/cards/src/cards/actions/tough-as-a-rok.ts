import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tough-as-a-rok.generated.ts";

export const toughAsARok = definePitchFamily(fabPitchFamilies["tough-as-a-rok"], {
  abilities: () => ({
    haveLessLifeThanEachOtherHeroSBasePowerNumber6Otherwise: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "conditional",
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
        },
        then: 6,
        else: 0,
      },
    },
  }),
});

export const { blue: toughAsARokBlue } = toughAsARok.cards;
