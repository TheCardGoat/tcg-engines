import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/force-of-nature.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const forceOfNature = definePitchFamily(fabPitchFamilies["force-of-nature"], {
  keywords: [
    {
      name: "specialization",
      hero: "Briar",
    },
    fusion("Earth"),
    goAgain,
  ],
  abilities: () => ({
    wheneverAttackActionControlHitsTurnIfIsGreater: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter(),
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasStatus: "power-greater-than-base",
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      },
    },
    ifForceNatureWasFusedNextAttackTurnGains: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});
export const { blue: forceOfNatureBlue } = forceOfNature.cards;
