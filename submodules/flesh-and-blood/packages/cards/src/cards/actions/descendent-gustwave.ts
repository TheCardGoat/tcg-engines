import { comboResolution } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/descendent-gustwave.generated.ts";
import { goAgain, combo } from "../shared/keywords.ts";
const abilities = {
  costReductionStatic: {
    kind: "static",
    staticKind: "play",
    condition: {
      type: "last-attack-this-combat-chain",
      names: ["Surging Strike"],
    },
    playEffect: {
      role: "cost-reduction",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
    },
    label: {
      name: "combo",
      params: {
        names: ["Surging Strike"],
      },
    },
  },
  comboPowerBonus: comboResolution({
    names: ["Surging Strike"],
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
  }),
} as const;
export const descendentGustwave = definePitchFamily(fabPitchFamilies["descendent-gustwave"], {
  keywords: [goAgain, combo],
  abilities: () => ({ ...abilities }),
});
export const {
  red: descendentGustwaveRed,
  yellow: descendentGustwaveYellow,
  blue: descendentGustwaveBlue,
} = descendentGustwave.cards;
