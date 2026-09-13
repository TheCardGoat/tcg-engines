import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/jinglewood-smash-hit.generated.ts";

export const jinglewoodSmashHit = defineCard(
  fabCardIdentitiesByCanonicalId["GK6TKkztnwHHwqKPrGR9k"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceTargetOpposingChoosesCreatesMightQuickenVigorTokenCreateCopperTokenGoAgain:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          layerKeywords: [goAgain],
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-and-create-token",
                options: ["might", "quicken", "vigor"],
                chooser: "opponent",
              },
              {
                type: "create-token",
                token: "copper",
                controller: "controller",
              },
            ],
          },
        },
      action0AttackHitsDestroy: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 0,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "attack-with",
              target: {
                selector: "self",
              },
            },
            {
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
                    kind: "source",
                    selector: "attack",
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-chain-link",
                matching: "first",
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
          ],
        },
      },
    },
  },
);
