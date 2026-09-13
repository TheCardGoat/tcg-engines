import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dragon-power.generated.ts";
const abilities = {
  onAttackModifyNumericPower: {
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
        type: "binding-matches",
        binding: "it",
        filter: {
          typeBox: {
            supertypes: ["Draconic"],
          },
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
} as const;
export const dragonPower = definePitchFamily(fabPitchFamilies["dragon-power"], {
  keywords: [],
  abilities: () => ({ ...abilities }),
});
export const {
  red: dragonPowerRed,
  yellow: dragonPowerYellow,
  blue: dragonPowerBlue,
} = dragonPower.cards;
