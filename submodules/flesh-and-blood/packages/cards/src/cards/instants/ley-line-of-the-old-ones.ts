import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ley-line-of-the-old-ones.generated.ts";

export const leyLineOfTheOldOnes = definePitchFamily(fabPitchFamilies["ley-line-of-the-old-ones"], {
  keywords: [legendary],
  abilities: () => ({
    atBeginningEndPhaseIfControlNoSeismicSurge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Seismic Surge",
            typeBox: {
              metatypes: ["Token"],
            },
          },
          comparison: {
            op: "eq",
            value: 0,
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
  }),
});

export const { blue: leyLineOfTheOldOnesBlue } = leyLineOfTheOldOnes.cards;
