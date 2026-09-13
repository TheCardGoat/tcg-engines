import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/laughing-knee-slappers.generated.ts";

export const laughingKneeSlappers = defineCard(
  fabCardIdentitiesByCanonicalId["mm6rHKbCkKKfD6h6tCMcK"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifControlMightVigorTokenGets2: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "and",
          conditions: [
            {
              type: "control-object",
              filter: {
                name: "Might",
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
