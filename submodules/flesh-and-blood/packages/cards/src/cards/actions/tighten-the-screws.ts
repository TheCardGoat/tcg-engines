import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tighten-the-screws.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tightenTheScrews = definePitchFamily(fabPitchFamilies["tighten-the-screws"], {
  keywords: [goAgain],
  abilities: () => ({
    nextMechanologistAttackTurnGetsNumber4Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
            },
          },
        },
      },
    },
    uCogControl: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "untap",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: tightenTheScrewsRed } = tightenTheScrews.cards;
