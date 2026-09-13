import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deadly-duo.generated.ts";
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
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-combat-chain",
        appliesTo: {
          next: attackActionFilter({ power: { op: "lte", value: 2 } }),
          events: ["play", "attack"],
        },
      },
    },
  },
} as const;
export const deadlyDuo = definePitchFamily(fabPitchFamilies["deadly-duo"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});
export const { red: deadlyDuoRed, yellow: deadlyDuoYellow, blue: deadlyDuoBlue } = deadlyDuo.cards;
