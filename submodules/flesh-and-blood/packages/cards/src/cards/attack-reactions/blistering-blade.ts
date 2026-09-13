import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/blistering-blade.generated.ts";

export const blisteringBlade = definePitchFamily(fabPitchFamilies["blistering-blade"], {
  abilities: () => ({
    daggerBoost: {
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
            type: "self-replacement",
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
            modification: {
              // CR 6.4.7a: the modification rewrites the preceding +2 on the
              // SAME declared target — re-declared verbatim (the replaced
              // step's outputBinding is never stamped).
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
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
            },
          },
        ],
      },
    },
  }),
});

export const { red: blisteringBladeRed } = blisteringBlade.cards;
