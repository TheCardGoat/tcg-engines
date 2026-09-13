import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/sandscour-greatbow.generated.ts";

export const sandscourGreatbow = defineCard(
  fabCardIdentitiesByCanonicalId["7kf9MgCRrqFckmcHLjtKb"],
  {
    abilities: {
      oncePerTurnActionResourceLookTopDeckPutArrowHandTopDeckFaceUpArsenalGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand", "deck"],
                  filter: {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                  count: 1,
                },
                to: {
                  zone: "arsenal",
                  visibility: "face-up",
                },
              },
            },
          ],
        },
      },
      wheneverArrowPutFaceUpArsenalDeckPutAimCounter: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "move-zone",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
                hasStatus: "face-up",
              },
              bindAs: "it",
            },
            to: "arsenal",
            from: ["deck"],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "aim",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  },
);
