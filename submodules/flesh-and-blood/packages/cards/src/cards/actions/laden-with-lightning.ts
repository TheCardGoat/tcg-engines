import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/laden-with-lightning.generated.ts";

export const ladenWithLightning = definePitchFamily(fabPitchFamilies["laden-with-lightning"], {
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
    lightningPitchedPlayCreateEmbodimentLightningToken: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-lightning-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-lightning",
        controller: "controller",
      },
      label: {
        name: "lightning-bond",
      },
    },
  }),
});

export const { red: ladenWithLightningRed } = ladenWithLightning.cards;
