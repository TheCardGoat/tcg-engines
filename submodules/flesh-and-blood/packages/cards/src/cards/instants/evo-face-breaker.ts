import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-face-breaker.generated.ts";

export const evoFaceBreaker = definePitchFamily(fabPitchFamilies["evo-face-breaker"], {
  abilities: () => ({
    ifHaveBaseArmsEquippedTransformXHyperDrivers: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Arms"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: { name: "Hyper Driver" },
              count: { type: "any-number" },
            },
            outputBinding: "evo-drivers",
          },
          {
            type: "transform-into-resolving-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-arms"],
              filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Arms"] } },
              count: 1,
            },
            additionalTargets: [
              { selector: "binding", binding: "evo-drivers", count: { type: "any-number" } },
            ],
          },
          {
            type: "if-you-do",
            effect: {
              type: "equip",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "prevention",
              preventionKind: "fixed",
              times: 1,
              amount: {
                type: "double",
                operands: [
                  {
                    type: "count",
                    what: "objects-under-source",
                    filter: { name: "Hyper Driver" },
                  },
                ],
              },
              shielded: {
                selector: "controller",
              },
              duration: "this-turn",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    wheneverBoostAttackActionMayDestroyUnderIfDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "boosted-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["under"],
              count: 1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { red: evoFaceBreakerRed } = evoFaceBreaker.cards;
