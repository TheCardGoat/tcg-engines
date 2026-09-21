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
                  // CR 8.3.1: weapon attacks carry the Weapon type (no Attack
                  // subtype); living allies carry the Ally subtype.
                  or: [
                    {
                      typeBox: {
                        types: ["Weapon"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Ally"],
                      },
                    },
                  ],
                },
              },
              then: {
                // CR 5.2.3c: the weapon/ally condition gates the allowance,
                // not a player decision — it applies by itself.
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
          ],
        },
      },
    },
  },
);
