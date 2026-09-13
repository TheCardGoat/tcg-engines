import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/toxic-tips.generated.ts";

export const toxicTips = defineCard(fabCardIdentitiesByCanonicalId["QCKJqg6QMPR9pLPBCJQJK"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyToxicTipsNextAttackActionPlayTurn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
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
            id: "whenHitsHeroCreateFrailtyInertiaBloodrotPoxToken",
            text: "",
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
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "choose-and-create-token",
                options: ["frailty", "inertia", "bloodrot-pox"],
                chooser: "controller",
                controller: "attack-target",
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
});
