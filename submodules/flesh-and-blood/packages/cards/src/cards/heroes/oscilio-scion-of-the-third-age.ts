import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/oscilio-scion-of-the-third-age.generated.ts";

export const oscilioScionOfTheThirdAge = defineCard(
  fabCardIdentitiesByCanonicalId["bdD7LdLhpgdfLwzCq6jBc"],
  {
    abilities: {
      instantResourceTapDestroyLightningFlowDiscardCreatePonderTokenInstantDiscardWayPlayTurn: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "destroy",
              filter: {
                name: "Lightning Flow",
              },
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              // Parity with OMN094 Adult remodel.
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "create-token",
              token: "ponder",
              controller: "controller",
            },
            {
              // Instant discarded → this-turn play permission (binding-matches).
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    types: ["Instant"],
                  },
                },
              },
              then: {
                type: "play-card",
                fromZones: ["graveyard"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  },
);
