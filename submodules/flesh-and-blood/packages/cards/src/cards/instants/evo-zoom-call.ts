import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-zoom-call.generated.ts";

export const evoZoomCall = definePitchFamily(fabPitchFamilies["evo-zoom-call"], {
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base head; transform equipped base (CR 8.5.36), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Head"],
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
    whenIsEquippedMayBanishFromHandIfDo: {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
          },
          then: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { yellow: evoZoomCallYellow } = evoZoomCall.cards;
