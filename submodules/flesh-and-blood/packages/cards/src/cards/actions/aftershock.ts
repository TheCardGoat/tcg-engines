import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/aftershock.generated.ts";

export const aftershock = definePitchFamily(fabPitchFamilies["aftershock"], {
  abilities: () => ({
    onAttackCreateTokenSeismicSurge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "performed-this-turn",
          event: "control-seismic-surge",
          player: "controller",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
        },
      },
    },
  }),
});
export const {
  red: aftershockRed,
  yellow: aftershockYellow,
  blue: aftershockBlue,
} = aftershock.cards;
