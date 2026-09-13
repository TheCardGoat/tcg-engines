import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/medkit.generated.ts";

export const medkit = definePitchFamily(fabPitchFamilies["medkit"], {
  abilities: () => ({
    actionPutBottomOwnersDeckGain2Life: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "move-to-deck",
        from: "self",
        position: "bottom",
        count: 1,
      },
      effect: {
        type: "gain-life",
        amount: 2,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});

export const { blue: medkitBlue } = medkit.cards;
