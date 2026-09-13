import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/head-shot.generated.ts";

const abilities = {
  triggeredMoveZoneModifyNumericPowerThisTurn: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "move-zone",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
        to: "arsenal",
        faceDown: false,
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
} as const;

export const headShot = definePitchFamily(fabPitchFamilies["head-shot"], {
  abilities: () => ({ ...abilities }),
});

export const { red: headShotRed, yellow: headShotYellow, blue: headShotBlue } = headShot.cards;
