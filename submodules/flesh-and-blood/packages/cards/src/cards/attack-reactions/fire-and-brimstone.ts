import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/fire-and-brimstone.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const fireAndBrimstone = definePitchFamily(fabPitchFamilies["fire-and-brimstone"], {
  keywords: [legendary],
  abilities: () => ({
    reduceCostForDraconicLinks: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
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
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    empowerDaggers: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon", "permanent", "combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
            outputBinding: "them",
          },
          {
            // CR 5.2.3c: the allowance applies to every bound dagger by
            // itself; no on-resolution decision exists.
            type: "modify-activation-limit",
            target: {
              selector: "binding",
              binding: "them",
            },
            operation: "additional",
            count: 1,
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { red: fireAndBrimstoneRed } = fireAndBrimstone.cards;
