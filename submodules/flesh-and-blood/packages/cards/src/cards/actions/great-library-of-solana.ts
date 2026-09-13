import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/great-library-of-solana.generated.ts";
import { goAgain, legendary } from "../shared/keywords.ts";

export const greatLibraryOfSolana = defineCard(
  fabCardIdentitiesByCanonicalId["fNGtM6WDcWMR6DcmjtRdw"],
  {
    keywords: [legendary],
    abilities: {
      atBeginningEachEndPhaseIfHeroHas2: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "for-each",
            target: {
              selector: "each-hero",
            },
            effect: {
              type: "conditional",
              condition: {
                type: "zone-count",
                zone: "pitch",
                player: "iteration-subject",
                filter: {
                  color: ["yellow"],
                },
                comparison: {
                  op: "gte",
                  value: 2,
                },
              },
              then: {
                type: "modify-numeric",
                property: "intellect",
                op: "add",
                amount: 1,
                target: {
                  selector: "iteration-subject",
                },
                duration: "this-turn",
              },
            },
          },
        },
      },
      actionDiscard2YellowColorStripsDestroyGreatLibrary: {
        kind: "activated",
        abilityType: "action",
        activatableBy: "any-hero",
        cost: {
          class: "effect",
          type: "discard",
          count: 2,
          filter: {
            color: ["yellow"],
          },
          from: "hand",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
);
