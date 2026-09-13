import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/honed-for-honor.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const honedForHonor = definePitchFamily(fabPitchFamilies["honed-for-honor"], {
  keywords: [{ name: "sharpen" }, goAgain],
  abilities: () => ({
    sequenceSharpenConditionalHasCounterPowerOptionalMoveCard: {
      type: "sequence",
      steps: [
        {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Sword"] } },
            count: 1,
          },
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "has-counter",
            counter: { kind: "numeric", value: 1, property: "power" },
            target: { selector: "binding", binding: "it" },
            comparison: { op: "gte", value: 3 },
          },
          then: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: { typeBox: { types: ["Attack Reaction"] } },
                count: 1,
              },
              to: { zone: "deck", position: "top" },
            },
          },
        },
      ],
    },
  }),
});

export const { blue: honedForHonorBlue } = honedForHonor.cards;
