import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/mandible-claw.generated.ts";

export const mandibleClaw = defineCard(fabCardIdentitiesByCanonicalId["PRzqJ97HHdM6f8bLKhGzQ"], {
  abilities: {
    oncePerTurnActionResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    discarded6MorePowerTurnAttacksGoAgain: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
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
      },
    },
  },
});
