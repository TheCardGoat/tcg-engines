import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bittering-thorns.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  onHitModifyNumericPower: {
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
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          events: ["play", "attack"],
        },
      },
    },
  },
} as const;

export const bitteringThorns = definePitchFamily(fabPitchFamilies["bittering-thorns"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: bitteringThornsRed,
  yellow: bitteringThornsYellow,
  blue: bitteringThornsBlue,
} = bitteringThorns.cards;
