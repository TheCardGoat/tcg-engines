import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cold-snap.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const coldSnap = definePitchFamily(fabPitchFamilies["cold-snap"], {
  keywords: [goAgain],
  abilities: (_parameter, { pitch }) => ({
    resolutionUnlessFreeze: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "freeze",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: { binding: "cold-snap-target-hero" },
            playerTarget: { selector: "any-hero" },
            playerTargetBinding: "cold-snap-target-hero",
            zones: ["arsenal", "permanent"],
            filter: {
              or: [
                {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                { hasStatus: "face-down-in-arsenal" },
                { hasStatus: "face-up-in-arsenal" },
              ],
            },
            count: 1,
          },
          duration: "until-start-of-own-next-turn",
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 4 - Number(pitch),
          },
          payer: { binding: "cold-snap-target-hero" },
        },
      },
    },
    staticTriggeredPlayPlayDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});

export const { red: coldSnapRed, yellow: coldSnapYellow, blue: coldSnapBlue } = coldSnap.cards;
