import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/brevant-civic-protector.generated.ts";

export const brevantCivicProtector = defineCard(
  fabCardIdentitiesByCanonicalId["jBtHRMcRntDhhGzKtzKFB"],
  {
    abilities: {
      anyNumberChivalryDeck: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "have-in-deck",
          subject: {
            name: "Chivalry",
          },
          duration: "permanent",
        },
      },
      wheneverProtectAnotherCreateMightToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "protect",
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
            type: "create-token",
            token: "might",
            controller: "controller",
          },
        },
      },
    },
  },
);
