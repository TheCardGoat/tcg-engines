import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/winter-s-wail.generated.ts";

export const winterSWail = defineCard(fabCardIdentitiesByCanonicalId["pCdJMzmgBMD8Mt8qhM7nC"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    icePitchedWayWintersWailGainsHitsCreateFrostbiteToken: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-ice-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsCreateFrostbiteToken",
            text: "",
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
                type: "create-token",
                token: "frostbite",
                controller: "attack-target",
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
