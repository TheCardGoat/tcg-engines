import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-ripper.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const shadowrealmRipper = definePitchFamily(fabPitchFamilies["shadowrealm-ripper"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksMayBanishFromHandIfShadowPlusTwo: {
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
            then: plusPower(2, { target: { selector: "self" } }),
          },
        },
      },
    },
  }),
});

export const {
  red: shadowrealmRipperRed,
  yellow: shadowrealmRipperYellow,
  blue: shadowrealmRipperBlue,
} = shadowrealmRipper.cards;
