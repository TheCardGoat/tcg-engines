import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rage-specter.generated.ts";

export const rageSpecter = definePitchFamily(fabPitchFamilies["rage-specter"], {
  keywords: [ward(1), ward(6)],
  abilities: () => ({
    entersArenaNoOtherIllusionistAurasGain1ActionPoint: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
        state: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Illusionist"],
              subtypes: ["Aura"],
            },
          },
          comparison: {
            op: "eq",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-action-points",
          amount: 1,
        },
      },
    },
    duringTurnWard6OtherwiseWard1: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "ward",
            value: {
              type: "conditional",
              condition: {
                type: "turn-player",
                who: "self",
              },
              then: 6,
              else: 1,
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { blue: rageSpecterBlue } = rageSpecter.cards;
