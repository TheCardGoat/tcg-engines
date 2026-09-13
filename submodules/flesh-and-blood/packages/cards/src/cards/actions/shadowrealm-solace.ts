import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-solace.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shadowrealmSolace = definePitchFamily(fabPitchFamilies["shadowrealm-solace"], {
  keywords: [goAgain],
  abilities: () => ({
    move: {
      type: "optional",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["banished"],
          count: 1,
        },
        to: { zone: "graveyard" },
        outputBinding: "it",
      },
      then: {
        type: "conditional",
        condition: {
          type: "binding-matches",
          binding: "it",
          filter: { typeBox: { subtypes: ["Zombie"] } },
        },
        then: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
    },
  }),
});

export const { blue: shadowrealmSolaceBlue } = shadowrealmSolace.cards;
