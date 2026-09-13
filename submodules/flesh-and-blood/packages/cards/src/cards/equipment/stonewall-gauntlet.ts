import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stonewall-gauntlet.generated.ts";

export const stonewallGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["gmd8mLNNzBJgQNdhDjCwH"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsAttackGreaterThanBaseOpposingAttacksGet: {
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
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-combat-chain",
          },
        },
      },
    },
  },
);
