import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-swiftness.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shadowrealmSwiftness = definePitchFamily(fabPitchFamilies["shadowrealm-swiftness"], {
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
        then: grantKeyword(goAgain, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
      },
    },
  }),
});

export const { yellow: shadowrealmSwiftnessYellow } = shadowrealmSwiftness.cards;
