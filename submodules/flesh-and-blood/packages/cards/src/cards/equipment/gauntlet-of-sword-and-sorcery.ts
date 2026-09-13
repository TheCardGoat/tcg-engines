import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlet-of-sword-and-sorcery.generated.ts";

export const gauntletOfSwordAndSorcery = defineCard(
  fabCardIdentitiesByCanonicalId["rjwJT7bmgDjKNjwgm7bKF"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      actionHeroNextAttackActionPlayTurnGetsWhen: {
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
              class: "mixed",
              type: "all",
              costs: [
                {
                  class: "effect",
                  type: "tap-self",
                },
                {
                  class: "effect",
                  type: "tap-hero",
                },
              ],
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenAttacksDeal1ArcaneDamageAnyOpposingTarget",
              text: "",
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
                  type: "sequence",
                  steps: [
                    {
                      type: "deal-damage",
                      damageType: "arcane",
                      amount: 1,
                      target: {
                        selector: "object",
                        declared: "on-stack",
                        player: "opponent",
                        zones: ["hero", "permanent"],
                        count: 1,
                      },
                    },
                    {
                      type: "conditional",
                      condition: {
                        type: "binding-numeric",
                        binding: "damage-dealt-this-way",
                        comparison: { op: "gt", value: 0 },
                      },
                      then: {
                        type: "modify-numeric",
                        property: "power",
                        op: "add",
                        amount: 1,
                        target: {
                          selector: "self",
                        },
                        duration: "this-turn",
                      },
                    },
                  ],
                },
              },
            },
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  },
);
