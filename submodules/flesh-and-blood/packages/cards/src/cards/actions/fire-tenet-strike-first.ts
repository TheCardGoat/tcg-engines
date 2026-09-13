import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fire-tenet-strike-first.generated.ts";
import { goAgain } from "../shared/keywords.ts";
const abilities = {
  onAttackModifyNumericPower: {
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
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-combat-chain",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
          events: ["play", "attack"],
        },
      },
    },
  },
} as const;
export const fireTenetStrikeFirst = definePitchFamily(fabPitchFamilies["fire-tenet-strike-first"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});
export const {
  red: fireTenetStrikeFirstRed,
  yellow: fireTenetStrikeFirstYellow,
  blue: fireTenetStrikeFirstBlue,
} = fireTenetStrikeFirst.cards;
