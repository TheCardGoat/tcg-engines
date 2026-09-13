import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vest-of-the-first-fist.generated.ts";

export const vestOfTheFirstFist = defineCard(
  fabCardIdentitiesByCanonicalId["dcMMQNzjpzQ76GQPpnQwz"],
  {
    abilities: {
      whenAttackActionControlHitsMayDestroyVestFirst: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter(),
              bindAs: "it",
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
              type: "gain-resources",
              amount: 2,
            },
          },
        },
      },
    },
  },
);
