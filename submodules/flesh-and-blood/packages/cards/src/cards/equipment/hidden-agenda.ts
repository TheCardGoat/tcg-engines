import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hidden-agenda.generated.ts";

export const hiddenAgenda = defineCard(fabCardIdentitiesByCanonicalId["dwfCfQLjJJNLpwrnmhcPt"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantTurnFaceDownArrowArsenalFaceUpGain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "turn-face-up",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["arsenal"],
          // Arrow is a FAB type-box token (types:["…","Arrow","…"]), not a
          // subtype — subtypes:["Arrow"] never matches.
          filter: {
            hasStatus: "face-down",
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
          count: 1,
        },
        outputBinding: "it",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-resources",
            amount: 1,
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
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
        ],
      },
    },
  },
});
