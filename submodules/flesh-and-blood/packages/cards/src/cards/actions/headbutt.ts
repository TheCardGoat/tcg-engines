import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/headbutt.generated.ts";

export const headbutt = definePitchFamily(fabPitchFamilies["headbutt"], {
  abilities: () => ({
    cantDefendedNonHeadEquipment: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          typeBox: {
            types: ["Equipment"],
            excludeSubtypes: ["Head"],
          },
        },
        duration: "this-chain-link",
      },
    },
    headEquippedDefendingDoesntGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "and",
        conditions: [
          {
            type: "equipped-count",
            filter: {
              typeBox: {
                subtypes: ["Head"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          {
            type: "not",
            condition: {
              type: "equipped-count",
              player: "opponent",
              filter: {
                typeBox: {
                  subtypes: ["Head"],
                },
              },
              comparison: {
                op: "gte",
                value: 1,
              },
            },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    deals4MoreDamagePut1DefenseCounterHeadEquippedThen0DefenseDestroy: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: -1,
              property: "defense",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Head"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                defense: {
                  op: "eq",
                  value: 0,
                },
              },
            },
            then: {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
        ],
      },
    }),
  }),
});

export const { blue: headbuttBlue } = headbutt.cards;
