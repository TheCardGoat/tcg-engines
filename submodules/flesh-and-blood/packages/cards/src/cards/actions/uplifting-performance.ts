import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/uplifting-performance.generated.ts";

export const upliftingPerformance = definePitchFamily(fabPitchFamilies["uplifting-performance"], {
  abilities: () => ({
    controlConfidenceToughnessTokenGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Confidence Or Toughness",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    whenHitsHeroCreateConfidenceToughnessToken: {
      kind: "static",
      staticKind: "triggered",
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "confidence-and-a-toughness",
          controller: "controller",
        },
      },
    },
  }),
});

export const { blue: upliftingPerformanceBlue } = upliftingPerformance.cards;
