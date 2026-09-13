import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-zip-line.generated.ts";

export const evoZipLine = definePitchFamily(fabPitchFamilies["evo-zip-line"], {
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base legs; transform equipped base (CR 8.5.36), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Legs"],
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
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-legs"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Legs"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    whenIsEquippedUp1TargetAttackGetsGo: {
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
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "at-resolution",
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
      label: {
        name: "transform",
      },
    },
  }),
});

export const { yellow: evoZipLineYellow } = evoZipLine.cards;
