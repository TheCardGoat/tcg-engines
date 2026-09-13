import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/lionclaw-maul.generated.ts";

export const lionclawMaul = defineCard(fabCardIdentitiesByCanonicalId["zRDd7cPpPd6KgTNtRPhbQ"], {
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
      label: {
        name: "the-crowd-boos",
      },
    },
    powerGreaterThanBaseGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    hitsCrowdBoos: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  },
});
