import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/perforate.generated.ts";

export const perforate = definePitchFamily(fabPitchFamilies["perforate"], {
  abilities: () => ({
    grantAdditionalDaggerAttack: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-activation-limit",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: 1,
              },
              operation: "additional",
              count: 1,
              duration: "this-turn",
              outputBinding: "it",
            },
            {
              type: "modify-activation-cost",
              op: "subtract",
              amount: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
    drawCard: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { yellow: perforateYellow } = perforate.cards;
