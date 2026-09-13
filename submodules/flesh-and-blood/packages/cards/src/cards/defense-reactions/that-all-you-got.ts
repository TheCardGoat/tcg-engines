import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/that-all-you-got.generated.ts";

export const thatAllYouGot = definePitchFamily(fabPitchFamilies["that-all-you-got"], {
  abilities: () => ({
    drawWhenChainCloses: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "combat-chain-close",
          actor: {
            kind: "none",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "defending-an-attack-with-2-or-less-p",
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

export const { yellow: thatAllYouGotYellow } = thatAllYouGot.cards;
