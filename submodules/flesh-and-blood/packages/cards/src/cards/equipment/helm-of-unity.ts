import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-unity.generated.ts";

export const helmOfUnity = defineCard(fabCardIdentitiesByCanonicalId["pwMHKpWQbDFMbH8pm77qd"], {
  keywords: [temper],
  abilities: {
    whenDefendsTogetherFromHandGets1UntilEnd: {
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
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "unity",
      },
    },
  },
});
