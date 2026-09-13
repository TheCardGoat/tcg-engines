import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-whizz-bang.generated.ts";

export const evoWhizzBang = definePitchFamily(fabPitchFamilies["evo-whizz-bang"], {
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Head"],
          },
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Head"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: { selector: "self" },
          },
        ],
      },
      label: { name: "transform" },
    },
    whenIsEquippedUp1TargetAttackGets1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: { type: "up-to", amount: 1 },
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
      label: { name: "transform" },
    },
  }),
});

export const { yellow: evoWhizzBangYellow } = evoWhizzBang.cards;
