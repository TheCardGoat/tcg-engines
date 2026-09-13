import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/yendurai.generated.ts";

export const yendurai = defineCard(fabCardIdentitiesByCanonicalId.gqTpfTkztdLpN8W6TpRtR, {
  abilities: {
    enterWithEnduranceCounter: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "endurance",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    preventDamageWithEnduranceCounter: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 3,
        shielded: {
          selector: "self",
        },
        optionalCost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "endurance",
          },
          count: 1,
        },
        duration: "while-in-arena",
      },
    },
  },
});
