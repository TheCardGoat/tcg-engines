import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cogwerx-tinker-rings.generated.ts";

export const cogwerxTinkerRings = defineCard(
  fabCardIdentitiesByCanonicalId["cqRf8LJ6Dt86pRfcDdJ7H"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsCreateGoldenCogToken: {
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
            type: "create-token",
            token: "golden-cog",
            controller: "controller",
          },
        },
      },
    },
  },
);
