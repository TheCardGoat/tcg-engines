import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/arakni-solitary-confinement.generated.ts";

export const arakniSolitaryConfinement = defineCard(
  fabCardIdentitiesByCanonicalId["jkwfjdcDbhRnDrPWDnwT9"],
  {
    abilities: {
      firstAttackStealthTurnGoAgain: {
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
