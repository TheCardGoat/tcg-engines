import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/nebula-blade.generated.ts";

export const nebulaBlade = defineCard(fabCardIdentitiesByCanonicalId["RWwk8hgBdnRdWfjkrfJHt"], {
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
    hitsCreateRunechantToken: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
    playedNonAttackActionTurnGets3Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "performed-this-turn",
        event: "play-non-attack-action",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
