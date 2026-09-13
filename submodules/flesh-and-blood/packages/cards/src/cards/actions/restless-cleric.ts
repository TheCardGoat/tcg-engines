import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-cleric.generated.ts";
import { decay, goAgain } from "../shared/keywords.ts";

export const restlessCleric = definePitchFamily(fabPitchFamilies["restless-cleric"], {
  keywords: [decay],
  abilities: () => ({
    heal: {
      kind: "activated",
      abilityType: "action",
      cost: { class: "effect", type: "tap-self" },
      layerKeywords: [goAgain],
      effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
    },
  }),
});
export const { red: restlessClericRed } = restlessCleric.cards;
