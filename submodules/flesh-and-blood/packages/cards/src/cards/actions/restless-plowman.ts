import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-plowman.generated.ts";
import { decay, goAgain } from "../shared/keywords.ts";

export const restlessPlowman = definePitchFamily(fabPitchFamilies["restless-plowman"], {
  keywords: [decay],
  abilities: () => ({
    harvest: {
      kind: "activated",
      abilityType: "action",
      cost: { class: "effect", type: "tap-self" },
      layerKeywords: [goAgain],
      effect: { type: "gain-resources", amount: 1 },
    },
  }),
});

export const { red: restlessPlowmanRed } = restlessPlowman.cards;
