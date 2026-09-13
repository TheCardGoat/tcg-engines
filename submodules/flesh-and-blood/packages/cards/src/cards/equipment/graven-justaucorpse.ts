import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/graven-justaucorpse.generated.ts";

export const gravenJustaucorpse = defineCard(
  fabCardIdentitiesByCanonicalId["wTC7KKjRHpQdTrHCTgkJj"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyDiscardGainEqualPitchValue: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
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
              type: "gain-resources",
              amount: {
                type: "reference",
                binding: "it",
                property: "pitch",
                missing: "zero",
              },
            },
          ],
        },
      },
    },
  },
);
