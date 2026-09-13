import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dragonscaler-flight-path.generated.ts";

export const dragonscalerFlightPath = defineCard(
  fabCardIdentitiesByCanonicalId["Tn6HrNTBn7GQJt8pGTLwQ"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyTargetDraconicAttackGetsGoAgainIf: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        costReduction: {
          amount: {
            type: "count",
            what: "chain-links",
            player: "controller",
            filter: {
              typeBox: {
                supertypes: ["Draconic"],
              },
            },
          },
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    supertypes: ["Draconic"],
                  },
                },
                count: 1,
              },
              duration: "this-turn",
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  or: [
                    {
                      typeBox: {
                        types: ["Weapon"],
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Ally", "Attack"],
                      },
                    },
                  ],
                },
              },
              then: {
                type: "optional",
                effect: {
                  type: "modify-activation-limit",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  operation: "additional",
                  count: 1,
                  duration: "this-turn",
                },
              },
            },
          ],
        },
      },
    },
  },
);
