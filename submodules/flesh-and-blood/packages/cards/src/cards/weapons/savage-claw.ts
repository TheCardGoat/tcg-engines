import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/savage-claw.generated.ts";

export const savageClaw = defineCard(fabCardIdentitiesByCanonicalId["cM6R7TqbFHp76wfPTjrzM"], {
  abilities: {
    actionResourceResourceTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    empowerAttackAfterPitchingSixPower: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "pitch-power-6", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
      },
    },
  },
});
