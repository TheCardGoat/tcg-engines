import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/solray-plating.generated.ts";

export const solrayPlating = defineCard(fabCardIdentitiesByCanonicalId["8PCQKGK7CgNzbdJfhrftK"], {
  keywords: [bladeBreak],
  abilities: {
    ifWouldBeDealtDamageMayBanishFromSoul: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        optionalCost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: 1,
        },
        duration: "while-in-arena",
        additionalModification: {
          type: "destroy",
          target: {
            selector: "self",
          },
          delay: "end-phase",
        },
      },
    },
  },
});
