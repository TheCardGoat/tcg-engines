import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/salvage-shot.generated.ts";

const abilities = {
  triggeredEffect: {
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
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  },
} as const;

export const salvageShot = definePitchFamily(fabPitchFamilies["salvage-shot"], {
  abilities: () => abilities,
});

export const {
  red: salvageShotRed,
  yellow: salvageShotYellow,
  blue: salvageShotBlue,
} = salvageShot.cards;
