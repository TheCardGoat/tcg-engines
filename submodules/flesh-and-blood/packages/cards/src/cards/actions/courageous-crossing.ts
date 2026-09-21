import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/courageous-crossing.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const courageousCrossing = definePitchFamily(fabPitchFamilies["courageous-crossing"], {
  keywords: [goAgain],
  abilities: () => ({
    createCourageTokenUnderTargetHeroSControl: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "courage",
        creator: "effect-controller",
        controller: "target-controller",
        target: { selector: "any-hero" },
      },
    },
    whenDefendsAttackGreaterThanBaseRemove1Counter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "object-numeric-comparison",
          target: { selector: "this-attack" },
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain", "weapon"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { blue: courageousCrossingBlue } = courageousCrossing.cards;
