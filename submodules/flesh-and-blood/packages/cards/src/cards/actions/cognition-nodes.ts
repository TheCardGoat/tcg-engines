import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cognition-nodes.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const cognitionNodes = definePitchFamily(fabPitchFamilies["cognition-nodes"], {
  abilities: () => ({
    actionIfThereAreNoSteamCountersCognitionNodes: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "conditional",
        condition: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnAttackReactionRemoveSteamCounterFrom: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsPutBottomOwnerSDeck",
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
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter(),
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});
export const { blue: cognitionNodesBlue } = cognitionNodes.cards;
