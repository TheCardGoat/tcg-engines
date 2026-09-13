import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/provoke.generated.ts";

export const provoke = definePitchFamily(fabPitchFamilies["provoke"], {
  abilities: () => ({
    revealAndForceDefense: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "attacking-with-weapon-this-chain-link",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  types: ["Action"],
                },
              },
            },
            then: {
              type: "add-defending",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            else: {
              type: "discard",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: provokeBlue } = provoke.cards;
