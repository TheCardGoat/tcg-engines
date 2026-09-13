import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/astral-assault.generated.ts";

const abilities = {
  onAttackDestroyModifyNumericPower: {
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
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Lightning Flow",
            },
            count: 1,
          },
        },
        then: {
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
  },
} as const;

export const astralAssault = definePitchFamily(fabPitchFamilies["astral-assault"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: astralAssaultRed,
  yellow: astralAssaultYellow,
  blue: astralAssaultBlue,
} = astralAssault.cards;
