import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mbrio-base-vizier.generated.ts";

export const mbrioBaseVizier = defineCard(fabCardIdentitiesByCanonicalId["MLfgFRDKbTbWj8fBgMrjJ"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    ifWouldBeDealtArcaneDamageMayRemoveSteam: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        optionalCost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          filter: {
            name: "Hyper Driver",
          },
        },
        // Continuous while equipped (not "while-condition" — no condition AST).
        duration: "while-in-arena",
      },
    },
  },
});
