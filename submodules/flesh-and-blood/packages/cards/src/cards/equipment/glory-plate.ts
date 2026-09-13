import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/glory-plate.generated.ts";

export const gloryPlate = defineCard(fabCardIdentitiesByCanonicalId["BbPCr6FPrbC9wdCFMgDFr"], {
  keywords: [guardwell],
  abilities: {
    gets1EachToughnessTokenHasLeftArenaTurn: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: {
          type: "count",
          what: "left-arena-this-turn",
          filter: {
            name: "Toughness",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  },
});
