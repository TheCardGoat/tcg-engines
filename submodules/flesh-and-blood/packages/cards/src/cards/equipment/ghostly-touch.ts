import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ghostly-touch.generated.ts";

export const ghostlyTouch = defineCard(fabCardIdentitiesByCanonicalId["rmdqRKFwTMWr97GPqNd6Q"], {
  abilities: {
    wheneverIllusionistAttackControlIsDestroyedByPhantasmPut: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Illusionist"],
                  },
                },
                {
                  hasKeyword: "phantasm",
                },
              ],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "haunt",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnActionRemoveHauntCounterFromGhostly: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "haunt",
        },
        count: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "become",
            source: "ally",
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                subtypes: ["Ally"],
              },
            },
            keywords: ["phantasm"],
            basePower: {
              type: "count",
              what: "counters-on-source",
              counter: {
                kind: "named",
                name: "haunt",
              },
            },
            baseLife: {
              type: "count",
              what: "counters-on-source",
              counter: {
                kind: "named",
                name: "haunt",
              },
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "oncePerTurnActionAttack",
                text: "",
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
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
