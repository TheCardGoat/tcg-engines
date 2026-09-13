import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/strong-stomach-for-adversity.generated.ts";

export const strongStomachForAdversity = defineCard(
  fabCardIdentitiesByCanonicalId["BdnFGgLNjHbmMd7jQnjQz"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifControlConfidenceMightTokenGets2: {
        kind: "static",
        staticKind: "continuous",
        // Same dual-token pattern as SUP011 plate-of-tough-love: two control-object
        // gates (not English residue name) + permanent continuous duration.
        condition: {
          type: "and",
          conditions: [
            {
              type: "control-object",
              filter: {
                name: "Confidence",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
            },
            {
              type: "control-object",
              filter: {
                name: "Might",
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
          duration: "permanent",
        },
      },
    },
  },
);
