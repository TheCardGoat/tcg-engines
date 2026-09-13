import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wounded-bull.generated.ts";

export const woundedBull = definePitchFamily(fabPitchFamilies["wounded-bull"], {
  abilities: () => ({
    behindOnLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: woundedBullRed,
  yellow: woundedBullYellow,
  blue: woundedBullBlue,
} = woundedBull.cards;
