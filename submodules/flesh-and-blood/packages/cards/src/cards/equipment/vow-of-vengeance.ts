import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vow-of-vengeance.generated.ts";

export const vowOfVengeance = defineCard(fabCardIdentitiesByCanonicalId["mtdP6wgpMpd6LJbpJ79TM"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionDestroyMarkTargetArakni: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      // "Mark target Arakni" — Arakni is a hero identity (hero zone), not an
      // arena permanent. moniker matches Arakni-named heroes; player any so
      // opposing Arakni seats are legal targets (controller defaults would
      // only scan self).
      effect: {
        type: "mark",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["hero"],
          filter: {
            moniker: "Arakni",
          },
          count: 1,
        },
      },
    },
  },
});
