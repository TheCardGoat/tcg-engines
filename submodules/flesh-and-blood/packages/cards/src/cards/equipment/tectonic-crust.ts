import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tectonic-crust.generated.ts";

export const tectonicCrust = defineCard(fabCardIdentitiesByCanonicalId["gjCz8rLDrG7h7MQpBwGHz"], {
  keywords: [temper],
  abilities: {
    whenDefendsTogetherEarthCreateSeismicSurgeToken: {
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
              typeBox: {
                supertypes: ["Earth"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
        },
      },
    },
  },
});
