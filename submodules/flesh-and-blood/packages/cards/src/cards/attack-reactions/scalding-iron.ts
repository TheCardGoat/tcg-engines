import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/scalding-iron.generated.ts";

export const scaldingIron = definePitchFamily(fabPitchFamilies["scalding-iron"], {
  abilities: () => ({
    boostForDraconicLinks: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { red: scaldingIronRed } = scaldingIron.cards;
