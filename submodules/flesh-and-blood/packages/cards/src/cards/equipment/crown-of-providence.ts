import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-providence.generated.ts";

export const crownOfProvidence = defineCard(
  fabCardIdentitiesByCanonicalId["NRHdp6LTtCDKbJngJPCmN"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendCrownProvidenceMayPutFromHandArsenal: {
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
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand", "arsenal"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      },
    },
  },
);
