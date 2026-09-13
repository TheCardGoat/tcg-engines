import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/oscilio-forked-continuum.generated.ts";

export const oscilioForkedContinuum = defineCard(
  fabCardIdentitiesByCanonicalId["nqbttmdCrgTbFBjJBzLtz"],
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
              // "Discard a card" — any one card from hand. (The generated
              // definition mis-parsed the trailing clause into a bogus name
              // filter "Card And Create A Ponder Token", which never matched.)
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
              // "and create a Ponder token" — this clause was dropped by the
              // generator; restored here.
              type: "create-token",
              token: "ponder",
              controller: "controller",
            },
            {
              // "If an instant is discarded this way, you may play it this turn."
              // Prefer binding-matches on the discard outputBinding over a
              // synthetic has-status stamp (Katsu/Blaze play-permission pattern).
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
