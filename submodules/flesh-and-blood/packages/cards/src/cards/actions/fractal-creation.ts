import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fractal-creation.generated.ts";

import { fragment } from "../shared/keywords.ts";

export const fractalCreation = definePitchFamily(fabPitchFamilies["fractal-creation"], {
  keywords: [fragment],
  abilities: () => ({
    whenHitsMayCreateTokenCopyAuraControl: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "create-token",
            controller: "controller",
            copySource: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});
export const { blue: fractalCreationBlue } = fractalCreation.cards;
