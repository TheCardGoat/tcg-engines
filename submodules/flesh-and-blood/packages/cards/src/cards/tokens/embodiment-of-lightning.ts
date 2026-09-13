import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/embodiment-of-lightning.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const embodimentOfLightning = defineCard(
  fabCardIdentitiesByCanonicalId.QBwTWNc9FMGQfwHRTTdHj,
  {
    abilities: {
      grantGoAgainToAttackAction: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
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
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  },
);
