import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/kimono-of-layered-lessons.generated.ts";

export const kimonoOfLayeredLessons = defineCard(
  fabCardIdentitiesByCanonicalId["hmNrmWJFJzgW6PDFGLBHM"],
  {
    keywords: [cloaked],
    abilities: {
      instantTurnFaceUpPut1Counter: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "chi",
              amount: 3,
            },
            {
              class: "effect",
              type: "turn-face-up",
              target: {
                selector: "self",
              },
            },
          ],
        },
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
      atStartTurnDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
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
