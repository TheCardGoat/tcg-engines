import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sky-skimmer.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const skySkimmer = definePitchFamily(fabPitchFamilies["sky-skimmer"], {
  abilities: () => ({
    activatedChoice: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap",
        filter: {
          typeBox: {
            subtypes: ["Cog"],
          },
        },
      },
      effect: {
        type: "choice",
        options: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});

export const {
  red: skySkimmerRed,
  yellow: skySkimmerYellow,
  blue: skySkimmerBlue,
} = skySkimmer.cards;
