import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/trampling-trackers.generated.ts";

export const tramplingTrackers = defineCard(
  fabCardIdentitiesByCanonicalId["bkdFB6qNrhLBgrTrmRpNJ"],
  {
    keywords: [temper],
    abilities: {
      wheneverBeatChestMayDestroyIfDoCreateAgility: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "beat-chest",
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
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "create-token",
              token: "agility",
              controller: "controller",
            },
          },
        },
      },
    },
  },
);
