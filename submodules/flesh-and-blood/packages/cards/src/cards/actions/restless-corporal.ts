import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-corporal.generated.ts";
import { decay, goAgain } from "../shared/keywords.ts";

export const restlessCorporal = definePitchFamily(fabPitchFamilies["restless-corporal"], {
  keywords: [decay],
  abilities: () => ({
    retrieve: {
      kind: "activated",
      abilityType: "action",
      cost: { class: "effect", type: "tap-self" },
      layerKeywords: [goAgain],
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["banished"],
          count: 1,
        },
        to: { zone: "graveyard" },
      },
    },
  }),
});
export const { red: restlessCorporalRed } = restlessCorporal.cards;
