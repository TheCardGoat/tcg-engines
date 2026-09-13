import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/reaping-blade.generated.ts";

export const reapingBlade = defineCard(fabCardIdentitiesByCanonicalId["HrWqnWfcFNdKB7TLnBLtC"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    moreLifeThanAnyOtherCantGainLife: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-life",
        subject: {
          selector: "highest-life-hero",
        },
        duration: "while-in-arena",
      },
    },
  },
});
