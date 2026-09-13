import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/breaker-helm-protos.generated.ts";

export const breakerHelmProtos = defineCard(
  fabCardIdentitiesByCanonicalId["MHDhBfch9wDpjrhrR6R7d"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsMayDiscardHyperDriverIfDoDraw: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  name: "Hyper Driver",
                },
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
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
                },
              ],
            },
          },
        },
      },
    },
  },
);
