import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/danse-macabre.generated.ts";

export const danseMacabre = defineCard(fabCardIdentitiesByCanonicalId["Q8FGWt6BwzqcHpRzmmkQP"], {
  keywords: [bladeBreak],
  abilities: {
    wheneverAllyControlEntersArenaMayPayIfDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: { kind: "controller", player: "ability-controller" },
            filter: { typeBox: { subtypes: ["Ally"] } },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            payer: "controller",
            cost: {
              class: "mixed",
              type: "all",
              costs: [
                { class: "asset", type: "resources", amount: 2 },
                { class: "effect", type: "tap-self" },
              ],
            },
          },
          then: {
            type: "sequence",
            steps: [
              grantKeyword(goAgain, {
                target: { selector: "binding", binding: "it" },
                duration: "this-turn",
                appliesTo: {
                  attacksOf: { binding: "it" },
                  // The ally itself is the attack source; ally cards do not
                  // gain an "Attack" subtype when their attack ability opens.
                  next: {},
                  count: 1,
                },
              }),
              {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: { name: "end-phase", actor: { kind: "any" }, observes: { kind: "none" } },
                },
                policy: { kind: "windowed", duration: "this-turn", matching: "first" },
                resolution: {
                  kind: "effect",
                  effect: { type: "destroy", target: { selector: "binding", binding: "it" } },
                },
              },
            ],
          },
        },
      },
    },
  },
});
