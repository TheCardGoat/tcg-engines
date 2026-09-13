import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-bloodhound.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const shadowrealmBloodhound = definePitchFamily(fabPitchFamilies["shadowrealm-bloodhound"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksMayBanishFromHandIfShadowGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: { typeBox: { supertypes: ["Shadow"] } },
            },
            then: grantKeyword(goAgain, { target: { selector: "self" } }),
          },
        },
      },
    },
  }),
});

export const {
  red: shadowrealmBloodhoundRed,
  yellow: shadowrealmBloodhoundYellow,
  blue: shadowrealmBloodhoundBlue,
} = shadowrealmBloodhound.cards;
