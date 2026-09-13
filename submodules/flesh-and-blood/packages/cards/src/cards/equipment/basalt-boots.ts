import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/basalt-boots.generated.ts";

export const basaltBoots = defineCard(fabCardIdentitiesByCanonicalId["cW9gnhd9dmMghRfHjzdgF"], {
  keywords: [temper],
  abilities: {
    ifControlSeismicSurgeTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Seismic Surge",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
