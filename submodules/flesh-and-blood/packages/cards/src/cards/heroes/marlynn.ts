import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/marlynn.generated.ts";

export const marlynn = defineCard(fabCardIdentitiesByCanonicalId["N7PFFQLkdzRMDhzDWJWwW"], {
  abilities: {
    actionTapDestroyGoldCreateGoldfinHarpoonHandGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "goldfin-harpoon",
        controller: "controller",
        to: {
          zone: "hand",
        },
      },
    },
    wheneverDrawDuringActionPhasePutArrowHandFaceUpArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "draw",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          during: {
            kind: "phase",
            phase: "action",
          },
        },
        state: {
          type: "turn-player",
          who: "self",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-up",
            },
            outputBinding: "it",
          },
        },
      },
    },
  },
});
