import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stand-ground.generated.ts";

export const standGround = defineCard(fabCardIdentitiesByCanonicalId["WJzNjPfQGqdTtjTHQP6rL"], {
  keywords: [temper],
  abilities: {
    ifControlMightTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Might",
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
    ifControlVigorTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Vigor",
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
