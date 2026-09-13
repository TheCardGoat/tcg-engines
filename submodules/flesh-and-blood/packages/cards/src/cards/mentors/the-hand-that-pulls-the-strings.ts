import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/the-hand-that-pulls-the-strings.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const theHandThatPullsTheStrings = defineCard(
  fabCardIdentitiesByCanonicalId.LLJdk7zHFrCth9m68rmf6,
  {
    abilities: {
      revealFromArsenal: {
        kind: "activated",
        functionalZones: ["arsenal"],
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack-reaction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 0,
        },
        condition: {
          type: "has-status",
          status: "face-down-in-your-arsenal",
        },
        effect: {
          type: "turn-face-up",
          target: {
            selector: "self",
          },
        },
      },
      grantFirstContractAttackBonuses: {
        kind: "static",
        staticKind: "while",
        functionalZones: ["arsenal"],
        condition: {
          type: "has-status",
          status: "face-up-in-arsenal",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
            },
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "attacking-a-royal-hero",
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
            },
          ],
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasLabel: "contract",
            },
            perTurn: true,
          },
        },
      },
      paySilverAtEnd: {
        kind: "static",
        staticKind: "triggered",
        functionalZones: ["arsenal"],
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
            type: "unless",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "move-card",
                  target: {
                    selector: "self",
                  },
                  to: {
                    zone: "deck",
                    position: "bottom",
                  },
                },
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              ],
            },
            escape: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Silver",
                },
                count: 1,
              },
            },
          },
        },
      },
    },
  },
);
