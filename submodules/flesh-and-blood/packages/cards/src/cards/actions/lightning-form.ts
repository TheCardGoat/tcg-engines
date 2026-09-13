import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lightning-form.generated.ts";

const abilities = {
  triggeredHitCreateTokenEmbodimentOfLightning: {
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
        type: "create-token",
        token: "embodiment-of-lightning",
        controller: "controller",
      },
    },
  },
} as const;

export const lightningForm = definePitchFamily(fabPitchFamilies["lightning-form"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: lightningFormRed,
  yellow: lightningFormYellow,
  blue: lightningFormBlue,
} = lightningForm.cards;
