import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/scowling-flesh-bag.generated.ts";

export const scowlingFleshBag = defineCard(
  fabCardIdentitiesByCanonicalId["czpGHfkkmgF6kFCQjfcC8"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsIntimidate: {
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
            type: "intimidate",
            target: "opponent",
          },
        },
        label: {
          name: "intimidate",
        },
      },
    },
  },
);
