import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hamstring-shot.generated.ts";

const abilities = {
  triggeredHitModifyNumericCostUntilEndOfNextTurn: {
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
        property: "cost",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "until-end-of-next-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          ordinal: 1,
          events: ["play", "attack"],
        },
      },
    },
  },
} as const;

export const hamstringShot = definePitchFamily(fabPitchFamilies["hamstring-shot"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: hamstringShotRed,
  yellow: hamstringShotYellow,
  blue: hamstringShotBlue,
} = hamstringShot.cards;
