import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/golden-glare.generated.ts";

export const goldenGlare = defineCard(fabCardIdentitiesByCanonicalId["69GnfBCnLKPjLMkhQ6gF6"], {
  keywords: [
    {
      name: "specialization",
      hero: "Victor",
    },
    bladeBreak,
  ],
  abilities: {
    whenDefendsTogether2MoreYellowCreateGoldToken: {
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
              color: ["yellow"],
            },
            count: {
              op: "gte",
              value: 2,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
    },
  },
});
