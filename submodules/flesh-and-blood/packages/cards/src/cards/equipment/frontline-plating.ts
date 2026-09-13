import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/frontline-plating.generated.ts";

export const frontlinePlating = defineCard(
  fabCardIdentitiesByCanonicalId["rWGNRWnzMBzgWzth9676b"],
  {
    keywords: [bladeBreak],
    abilities: {
      atBeginningEndPhasePut1Counter: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
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
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: -1,
              property: "defense",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
);
