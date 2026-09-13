import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/staff-of-verdant-shoots.generated.ts";

export const staffOfVerdantShoots = defineCard(
  fabCardIdentitiesByCanonicalId["PQgjdCTFwm89BmcWP9n7d"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceAmp1GoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "amp",
          amount: 1,
        },
      },
      oneMoreEarthPitchedWayNextTimeDealArcaneDamageTurnCreateEmbodimentEarthToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "pitched-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Earth"],
                },
              },
            },
            amount: {
              op: "gte",
              value: 1,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "deal-damage",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
                damageType: "arcane",
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "create-token",
                token: "embodiment-of-earth",
                controller: "controller",
              },
            },
          },
        },
      },
    },
  },
);
