import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-walker.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const shadowrealmWalker = definePitchFamily(fabPitchFamilies["shadowrealm-walker"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksMayBanishFromHandIfShadowCreateGate: {
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
            then: createToken("gate-to-i-arathael"),
          },
        },
      },
    },
  }),
});

export const {
  red: shadowrealmWalkerRed,
  yellow: shadowrealmWalkerYellow,
  blue: shadowrealmWalkerBlue,
} = shadowrealmWalker.cards;
