import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silverstride-dodgers.generated.ts";

export const silverstrideDodgers = defineCard(
  fabCardIdentitiesByCanonicalId["qLHCbFDHBQbzKGTTBq8PW"],
  {
    keywords: [temper],
    abilities: {
      ifControlFlurryTokenGets1: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "control-object",
          filter: {
            name: "Flurry",
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
  },
);
