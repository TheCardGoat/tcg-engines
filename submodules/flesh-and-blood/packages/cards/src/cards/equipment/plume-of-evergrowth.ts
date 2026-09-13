import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/plume-of-evergrowth.generated.ts";

export const plumeOfEvergrowth = defineCard(
  fabCardIdentitiesByCanonicalId["CRDtq9LpbDjKKbCkfcC7H"],
  {
    abilities: {
      instantDestroyPlumeEvergrowthReturnTargetEarthActionEarth: {
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
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              or: [
                {
                  typeBox: {
                    supertypes: ["Earth"],
                    types: ["Action"],
                  },
                },
                {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Earth"],
                      },
                    },
                    {
                      typeBox: {
                        types: ["Instant"],
                      },
                    },
                  ],
                },
              ],
            },
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
    },
  },
);
