import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/outside-interference.generated.ts";

export const outsideInterference = definePitchFamily(fabPitchFamilies["outside-interference"], {
  abilities: () => ({
    instantDiscardRevealReviledAttackActionInventoryPutHand: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["inventory"],
                filter: {
                  typeBox: {
                    supertypes: ["Reviled"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "it",
              },
              to: {
                zone: "hand",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: outsideInterferenceBlue } = outsideInterference.cards;
