import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/feeding-frenzy.generated.ts";

export const feedingFrenzy = definePitchFamily(fabPitchFamilies["feeding-frenzy"], {
  keywords: [bloodDebt],

  abilities: () => ({
    onAttackBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
    gainGoAgainAfterBanishingSixPowerCard: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      effect: grantKeyword(goAgain, { target: { selector: "self" } }),
    },
  }),
});

export const {
  red: feedingFrenzyRed,
  yellow: feedingFrenzyYellow,
  blue: feedingFrenzyBlue,
} = feedingFrenzy.cards;
