import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/affirm-loyalty.generated.ts";

export const affirmLoyalty = definePitchFamily(fabPitchFamilies["affirm-loyalty"], {
  abilities: () => ({
    daggerBoostAndFealty: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
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
              type: "compare-amount",
              amount: {
                type: "count",
                what: "chain-links",
                player: "controller",
                filter: { typeBox: { supertypes: ["Draconic"] } },
              },
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "create-token",
              token: "fealty",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { red: affirmLoyaltyRed } = affirmLoyalty.cards;
