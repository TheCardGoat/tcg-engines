import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/starlight-striders.generated.ts";

export const starlightStriders = defineCard(
  fabCardIdentitiesByCanonicalId["dCkbCnQ7pcjfbQ7k8GhFk"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayRevealInstantFromHandIfDo: {
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
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    types: ["Instant"],
                  },
                },
                count: 1,
              },
            },
            // "If you do" — only after accepting optional and resolving reveal.
            then: {
              type: "create-token",
              token: "embodiment-of-lightning",
              controller: "controller",
            },
          },
        },
      },
    },
  },
);
