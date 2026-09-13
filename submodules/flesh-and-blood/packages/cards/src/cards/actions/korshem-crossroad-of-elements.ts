import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/korshem-crossroad-of-elements.generated.ts";
import { goAgain, legendary } from "../shared/keywords.ts";

export const korshemCrossroadOfElements = defineCard(
  fabCardIdentitiesByCanonicalId.jbDgmHNWr6GGD6GqmBCTf,
  {
    keywords: [legendary, goAgain],
    abilities: {
      rewardCardReveals: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "reveal",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "revealed-card",
              relationship: {
                kind: "any",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "choice",
            options: [
              {
                type: "gain-resources",
                amount: 1,
                target: {
                  binding: "it",
                },
              },
              {
                type: "gain-life",
                amount: 1,
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
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
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      types: ["Action"],
                    },
                    hasStatus: "defending",
                  },
                },
              },
            ],
          },
        },
      },
      destroyIfNoHeroGainedResourcesLifePowerOrDefense: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "end-phase",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "not",
            condition: {
              type: "or",
              conditions: [
                { type: "performed-this-turn", event: "draw", player: "controller" },
                { type: "performed-this-turn", event: "lose-life", player: "controller" },
              ],
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
  },
);
