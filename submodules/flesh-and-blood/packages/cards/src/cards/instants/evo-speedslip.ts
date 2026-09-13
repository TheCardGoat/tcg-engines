import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { arcaneBarrier, boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-speedslip.generated.ts";

export const evoSpeedslip = definePitchFamily(fabPitchFamilies["evo-speedslip"], {
  keywords: [arcaneBarrier(1)],
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed "base legs" requires Base+Legs, not any equipped Legs.
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
    },
    whenIsEquippedNextAttackActionPlayTurnGets: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "player",
            player: "ability-controller",
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
            keyword: boost,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  }),
});

export const { blue: evoSpeedslipBlue } = evoSpeedslip.cards;
