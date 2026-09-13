import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/arakni-5l-p3d-7hru-7h3-cr4x.generated.ts";

export const arakni5lP3d7hru7h3Cr4x = defineCard(
  fabCardIdentitiesByCanonicalId["nkBnGcCDpf9KHChtrrN6b"],
  {
    abilities: {
      firstAttackStealthTurnGetsGoAgain: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasKeyword: "stealth",
            },
            perTurn: true,
          },
        },
      },
    },
  },
);
