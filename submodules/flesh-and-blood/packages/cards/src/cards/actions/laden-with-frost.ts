import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/laden-with-frost.generated.ts";

export const ladenWithFrost = definePitchFamily(fabPitchFamilies["laden-with-frost"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    icePitchedPlayCreateFrostbiteTokenTargetHeros: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-ice-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "frostbite",
        controller: "any",
      },
      label: {
        name: "ice-bond",
      },
    },
  }),
});

export const { red: ladenWithFrostRed } = ladenWithFrost.cards;
