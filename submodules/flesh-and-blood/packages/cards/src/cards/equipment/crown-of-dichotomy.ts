import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-dichotomy.generated.ts";

export const crownOfDichotomy = defineCard(
  fabCardIdentitiesByCanonicalId["CQLdjjNmHTMfDnqzW6TLg"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      actionDestroyCrownDichotomyPutTargetRunebladeAttackAction: {
        kind: "activated",
        abilityType: "action",
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
              type: "destroy-self",
            },
          ],
        },
        // Printed: target Runeblade AAC *and* target Runeblade non-attack Action
        // from GY → top of deck in any order. Two distinct on-stack targets (not
        // OR count 2). Sequential put-top: second move is topmost; free reorder
        // among the pair is not modelled as a separate ordering decision.
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    supertypes: ["Runeblade"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    supertypes: ["Runeblade"],
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
            },
          ],
        },
      },
    },
  },
);
