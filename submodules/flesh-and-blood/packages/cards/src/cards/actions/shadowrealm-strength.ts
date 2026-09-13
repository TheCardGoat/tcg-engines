import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-strength.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shadowrealmStrength = definePitchFamily(fabPitchFamilies["shadowrealm-strength"], {
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
        then: plusPower(3, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
      },
    },
  }),
});

export const { red: shadowrealmStrengthRed } = shadowrealmStrength.cards;
