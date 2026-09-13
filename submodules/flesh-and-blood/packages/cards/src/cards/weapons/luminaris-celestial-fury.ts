import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/luminaris-celestial-fury.generated.ts";

export const luminarisCelestialFury = defineCard(
  fabCardIdentitiesByCanonicalId["z8GG8N7Lkg6BQR7FnWcwp"],
  {
    keywords: [goAgain],
    abilities: {
      oncePerTurnInstantResourceResourceTargetAngelAttackAttackActionHeraldNameGetsGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
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
              or: [
                {
                  and: [
                    {
                      typeBox: {
                        subtypes: ["Angel"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                  ],
                },
                {
                  and: [
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      nameContains: "Herald",
                    },
                  ],
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
