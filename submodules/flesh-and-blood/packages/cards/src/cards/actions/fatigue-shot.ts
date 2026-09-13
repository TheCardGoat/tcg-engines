import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fatigue-shot.generated.ts";
const abilities = {
  onHitModifyNumericPower: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "divide",
        amount: 2,
        rounding: "up",
        target: {
          selector: "this-attack",
        },
        duration: "until-end-of-their-next-turn",
        appliesTo: {
          next: attackActionFilter(),
          events: ["play"],
          ordinal: 1,
        },
      },
    },
  },
} as const;
export const fatigueShot = definePitchFamily(fabPitchFamilies["fatigue-shot"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: fatigueShotRed,
  yellow: fatigueShotYellow,
  blue: fatigueShotBlue,
} = fatigueShot.cards;
