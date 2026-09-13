import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dash-i-o.generated.ts";

export const dashIO = defineCard(fabCardIdentitiesByCanonicalId["LkqQpr7QL8KpnqMh7dHpR"], {
  abilities: {
    lookTopDeckAnyTime: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "look",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        duration: "permanent",
      },
    },
    playMechanologistItemCost01TopDeckThoughWereInstantCostsAdditionalResourcePlay: {
      // Printed: once per turn, play a cost 0/1 Mechanologist item from the top of
      // the deck as though it were an instant; it costs an additional {r}.
      // Modeled as a static play permission (same family as banished Evo grants)
      // with ordered deck position + surcharge, not a one-shot optional sequence.
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["deck"],
        position: "top",
        filter: {
          and: [
            {
              typeBox: {
                supertypes: ["Mechanologist"],
              },
            },
            {
              typeBox: {
                subtypes: ["Item"],
              },
            },
          ],
          // Base cost ≤1 (surcharge is applied via costModification, not this filter).
          numeric: [
            {
              property: "cost",
              basis: "base",
              comparison: { op: "lte", value: 1 },
            },
          ],
        },
        asType: "instant",
        costModification: {
          increase: 1,
        },
      },
    },
  },
});
