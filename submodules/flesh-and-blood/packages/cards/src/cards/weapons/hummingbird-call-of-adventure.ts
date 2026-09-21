import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hummingbird-call-of-adventure.generated.ts";

export const hummingbirdCallOfAdventure = defineCard(
  fabCardIdentitiesByCanonicalId["mgrmPqRmdHfMbptFfDcbC"],
  {
    abilities: {
      startTurnChoose1CreatesQuickenTokenDrawsGains1Life: {
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
        resolution: semanticTriggeredModalResolution({
          kind: "modal",
          choose: 1,
          modes: {
            createsQuickenToken: {
              kind: "resolution",
              effect: {
                type: "create-token",
                token: "quicken",
                creator: "token-controller",
                controller: "each",
              },
            },
            draws: {
              kind: "resolution",
              effect: {
                type: "draw",
                count: 1,
                player: "each",
              },
            },
            gains1Life: {
              kind: "resolution",
              effect: {
                type: "gain-life",
                amount: 1,
                target: {
                  selector: "each-hero",
                },
              },
            },
          },
        }),
      },
    },
  },
);
