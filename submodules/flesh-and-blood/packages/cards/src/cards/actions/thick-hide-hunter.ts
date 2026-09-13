import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/thick-hide-hunter.generated.ts";

export const thickHideHunter = definePitchFamily(fabPitchFamilies["thick-hide-hunter"], {
  abilities: () => ({
    whenAttacksDefendsDiscardRandom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
            random: true,
          },
          random: true,
          outputBinding: "it",
        },
      },
    },
    whenAttacksDefendsDiscardRandomWhenAttacksDefendsDiscardRandom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
            random: true,
          },
          random: true,
          outputBinding: "it",
        },
      },
    },
  }),
});

export const { yellow: thickHideHunterYellow } = thickHideHunter.cards;
