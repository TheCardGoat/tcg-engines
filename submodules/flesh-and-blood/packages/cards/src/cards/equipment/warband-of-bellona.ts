import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/warband-of-bellona.generated.ts";

export const warbandOfBellona = defineCard(
  fabCardIdentitiesByCanonicalId["KHDc7Tmt7fNcbRg6FDtn8"],
  {
    keywords: [temper],
    abilities: {
      actionDestroyNextTimeAttackTurnMayChargeHero: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        // "The next time you attack this turn, you may charge… If a yellow card
        // is charged this way, draw" — charge + yellow check must live inside the
        // one-shot delayed attack clause (not siblings at activation). Charge
        // picks a hand card (ASB003 pattern), not bare controller.
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              // Warband is destroyed at activation, so it is not part of the
              // attack event it watches; observe the controller's attack
              // without binding any event object to this card.
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "optional",
                  effect: {
                    type: "charge",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "chargedCard",
                    filter: { color: ["yellow"] },
                  },
                  then: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
);
