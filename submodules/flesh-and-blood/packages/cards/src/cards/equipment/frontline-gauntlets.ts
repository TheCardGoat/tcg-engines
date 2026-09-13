import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/frontline-gauntlets.generated.ts";

export const frontlineGauntlets = defineCard(
  fabCardIdentitiesByCanonicalId["9WFrC8Knr9qdtRbfCWq8c"],
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
