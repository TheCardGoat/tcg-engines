import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/havoc-wrap.generated.ts";

export const havocWrap = defineCard(fabCardIdentitiesByCanonicalId["FHdcQjB7mGbTgzJnmPmhc"], {
  keywords: [battleworn],
  abilities: {
    actionGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      // Printed "Go again" is a layer keyword on the action (AP refund), not a
      // grant-property to the equipment object — mirrors DVR004 / EVR103.
      layerKeywords: [goAgain],
      // Pure go-again action: no additional payload beyond the layer keyword.
      effect: {
        type: "sequence",
        steps: [],
      },
    },
    ifIsTappedCostLessPlayDoesnTUntap: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "tapped",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "untap",
            subject: {
              selector: "self",
            },
            duration: "while-in-arena",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "atStartTurnDestroy",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "start-phase",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "none",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "destroy",
                    target: {
                      selector: "self",
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  },
});
