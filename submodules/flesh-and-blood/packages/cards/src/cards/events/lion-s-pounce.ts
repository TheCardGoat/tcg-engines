import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/lion-s-pounce.generated.ts";

export const lionSPounce = defineCard(fabCardIdentitiesByCanonicalId.pdQGjBWQgfnrqhhLDGMkC, {
  abilities: {
    attackEachHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "attack-target",
        target: "each-hero",
        duration: "this-combat-chain",
      },
    },
  },
});
