import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rockyard-rodeo.generated.ts";

export const rockyardRodeo = definePitchFamily(fabPitchFamilies["rockyard-rodeo"], {
  abilities: () => ({
    powerEqualHighestBasePowerWeapons: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "max",
        property: "power",
        filter: {
          typeBox: {
            types: ["Weapon"],
          },
        },
        player: "controller",
      },
    },
  }),
});

export const { blue: rockyardRodeoBlue } = rockyardRodeo.cards;
