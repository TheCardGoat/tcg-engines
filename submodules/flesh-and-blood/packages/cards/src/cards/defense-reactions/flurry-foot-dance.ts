import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/flurry-foot-dance.generated.ts";

export const flurryFootDance = definePitchFamily(fabPitchFamilies["flurry-foot-dance"], {
  abilities: () => ({
    gainDefenseWithFlurry: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "control-object",
          filter: {
            name: "Flurry",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { yellow: flurryFootDanceYellow } = flurryFootDance.cards;
