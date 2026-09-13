import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-fyendal.generated.ts";

export const tomeOfFyendal = definePitchFamily(fabPitchFamilies["tome-of-fyendal"], {
  abilities: () => ({
    drawNumber2: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
    },
    playedFromArsenalGainNumber1LifeForEachInHand: {
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
          type: "gain-life",
          amount: {
            type: "count",
            what: "cards-in-hand",
            player: "controller",
          },
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { yellow: tomeOfFyendalYellow } = tomeOfFyendal.cards;
