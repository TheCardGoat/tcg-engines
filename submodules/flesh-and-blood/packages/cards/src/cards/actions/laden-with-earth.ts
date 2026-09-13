import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/laden-with-earth.generated.ts";

export const ladenWithEarth = definePitchFamily(fabPitchFamilies["laden-with-earth"], {
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
    earthPitchedPlayCreateEmbodimentEarthToken: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-earth-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-earth",
        controller: "controller",
      },
      label: {
        name: "earth-bond",
      },
    },
  }),
});

export const { red: ladenWithEarthRed } = ladenWithEarth.cards;
