import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/inverter-s-nightcowl.generated.ts";

export const inverterSNightcowl = defineCard(
  fabCardIdentitiesByCanonicalId["gMWcDdjLpcdzMFDTBNpmM"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyUntilEndTurnWheneverPlayAttackAction: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        // Printed "whenever you play an attack action card with stealth" this turn —
        // multi-fire until EOT (not one-shot). Attack is a type-box subtype,
        // while Action is the card type.
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "controller",
                  player: "ability-controller",
                },
                filter: attackActionFilter({ hasKeyword: "stealth" }),
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
              type: "gain-resources",
              amount: 1,
            },
          },
        },
      },
    },
  },
);
