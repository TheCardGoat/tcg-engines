import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tremor-of-resistance.generated.ts";

export const tremorOfResistance = defineCard(
  fabCardIdentitiesByCanonicalId["M9wMDWRkKRKjz7MBLMWLk"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifControlSeismicSurgeTokenGets2: {
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
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
