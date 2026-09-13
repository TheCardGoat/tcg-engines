import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blow-for-a-blow.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const blowForABlow = definePitchFamily(fabPitchFamilies["blow-for-a-blow"], {
  abilities: () => ({
    whenIsPlayedIfHaveLessThanOpposingHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    whenHitsDeal1DamageAnyTarget: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            player: "any",
            zones: ["hero", "permanent"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: blowForABlowRed } = blowForABlow.cards;
