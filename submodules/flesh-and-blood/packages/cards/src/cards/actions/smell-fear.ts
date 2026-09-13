import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smell-fear.generated.ts";
import { beatChest, goAgain } from "../shared/keywords.ts";

export const smellFear = definePitchFamily(fabPitchFamilies["smell-fear"], {
  parameters: { blue: 2, yellow: 3 },
  keywords: [beatChest, goAgain],
  abilities: (amount) => ({
    intimidateAfterBeatChest: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "beat-chest", player: "controller" },
      effect: {
        type: "intimidate",
        target: "opponent",
      },
      label: {
        name: "intimidate",
      },
    },
    grantPowerAfterIntimidating: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "ifYouVeIntimidated2OrMoreTimesThisTurn",
            text: "",
            kind: "resolution",
            condition: {
              type: "compare-amount",
              amount: { type: "count", what: "intimidates-this-turn" },
              comparison: { op: "gte", value: 2 },
            },
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Brute"],
            },
          },
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { blue: smellFearBlue, yellow: smellFearYellow } = smellFear.cards;
