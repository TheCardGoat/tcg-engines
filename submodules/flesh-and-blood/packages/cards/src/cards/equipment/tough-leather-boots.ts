import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tough-leather-boots.generated.ts";

export const toughLeatherBoots = defineCard(
  fabCardIdentitiesByCanonicalId["BPkPddj9wRpjhfhWcb6bw"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifControlToughnessVigorTokenGets2: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "and",
          conditions: [
            {
              type: "control-object",
              filter: {
                name: "Toughness",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
            },
            {
              type: "control-object",
              filter: {
                name: "Vigor",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
            },
          ],
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
