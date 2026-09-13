import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/whispering-mist.generated.ts";

export const whisperingMist = definePitchFamily(fabPitchFamilies["whispering-mist"], {
  abilities: () => ({
    untilEndTurnBlueAttacksAttacksEphemeralGet1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            and: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                or: [
                  {
                    color: ["blue"],
                  },
                  {
                    hasKeyword: "ephemeral",
                  },
                ],
              },
            ],
          },
          count: { type: "all" },
        },
      },
    },
  }),
});

export const { blue: whisperingMistBlue } = whisperingMist.cards;
