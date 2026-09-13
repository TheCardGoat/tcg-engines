import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silent-stilettos.generated.ts";

export const silentStilettos = defineCard(fabCardIdentitiesByCanonicalId["mtJLcqGChkjz6FTmL9pKT"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    wheneverAttackingAllyControlDiesAttackActionControlIs: {
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
                    subtypes: ["Ally"],
                  },
                },
                {
                  hasStatus: "attacking",
                },
              ],
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            payer: "controller",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "gain-action-points",
                amount: 1,
              },
            ],
          },
        },
      },
    },
    wheneverAttackingAllyControlDiesAttackActionControlIs2: {
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
                attackActionFilter(),
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
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            payer: "controller",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "gain-action-points",
                amount: 1,
              },
            ],
          },
        },
      },
    },
  },
});
