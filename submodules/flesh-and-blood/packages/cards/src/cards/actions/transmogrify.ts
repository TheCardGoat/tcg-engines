import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/transmogrify.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {
  resolutionSequence: {
    kind: "resolution",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "grant-property",
          property: {
            kind: "supertype",
            value: "Illusionist",
          },
          duration: "this-turn",
          appliesTo: {
            next: attackActionFilter(),
            events: ["play", "attack"],
          },
        },
        {
          type: "modify-numeric",
          property: "power",
          op: "set",
          amount: 8,
          duration: "this-turn",
          appliesTo: {
            next: attackActionFilter(),
            events: ["play", "attack"],
          },
        },
        {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "phantasm",
            },
          },
          duration: "this-turn",
          appliesTo: {
            next: attackActionFilter(),
            events: ["play", "attack"],
          },
        },
      ],
    },
  },
} as const;

export const transmogrify = definePitchFamily(fabPitchFamilies["transmogrify"], {
  keywords: [goAgain],
  abilities: () => abilities,
});

export const {
  red: transmogrifyRed,
  yellow: transmogrifyYellow,
  blue: transmogrifyBlue,
} = transmogrify.cards;
