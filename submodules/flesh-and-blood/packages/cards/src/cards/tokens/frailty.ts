import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/frailty.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const frailty = defineCard(fabCardIdentitiesByCanonicalId.KPWKQmMgm7rmM7bfFw9gF, {
  abilities: {
    reduceArsenalAndWeaponAttackPower: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["combat-chain"],
              filter: attackActionFilter({ playedFromZones: ["arsenal"] }),
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
        ],
      },
    },
    destroyAtEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
