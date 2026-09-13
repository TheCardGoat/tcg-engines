import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/commanding-performance.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const commandingPerformance = definePitchFamily(fabPitchFamilies["commanding-performance"], {
  keywords: [goAgain],
  abilities: () => ({
    nextWarriorAttackTurnGets3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Warrior"],
            },
          },
        },
      },
    },
    untilEndTurnWarriorAttacksGetWhenIsDefended: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenIsDefendedBy1MoreAttackActionDestroy",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "defend",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "event-object",
                  selector: "defender",
                  relationship: {
                    kind: "any",
                  },
                  filter: attackActionFilter(),
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "defending-hero",
                  zones: ["arsenal"],
                  count: 1,
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Warrior"],
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: commandingPerformanceRed } = commandingPerformance.cards;
