import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/plate-of-tough-love.generated.ts";

export const plateOfToughLove = defineCard(
  fabCardIdentitiesByCanonicalId["qRKjzf8nTgdBt8BMMgRPJ"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifControlConfidenceToughnessTokenGets2: {
        kind: "static",
        staticKind: "continuous",
        // Printed "a Confidence and a Toughness token" — two control gates, not a
        // single English-residue name. Continuous while-condition re-evaluates
        // while equipped (duration permanent, not one-shot this-turn).
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
                name: "Toughness",
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
