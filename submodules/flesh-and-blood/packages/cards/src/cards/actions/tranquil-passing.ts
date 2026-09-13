import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tranquil-passing.generated.ts";
import { ward } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "enter-arena",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
              cost: {
                op: "lte",
                value: 3,
              },
            },
            count: 1,
          },
          until: "while-in-arena",
        },
      },
    },
  },
} as const;

export const tranquilPassing = definePitchFamily(fabPitchFamilies["tranquil-passing"], {
  keywords: [ward(1)],
  abilities: () => abilities,
});

export const {
  red: tranquilPassingRed,
  yellow: tranquilPassingYellow,
  blue: tranquilPassingBlue,
} = tranquilPassing.cards;
