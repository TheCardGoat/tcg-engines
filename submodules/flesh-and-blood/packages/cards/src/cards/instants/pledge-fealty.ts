import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/pledge-fealty.generated.ts";

export const pledgeFealty = definePitchFamily(fabPitchFamilies["pledge-fealty"], {
  abilities: () => ({
    createFealtyToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "fealty",
        controller: "controller",
      },
    },
  }),
});

export const { red: pledgeFealtyRed } = pledgeFealty.cards;
