import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/drop-of-dragon-blood.generated.ts";

export const dropOfDragonBlood = definePitchFamily(fabPitchFamilies["drop-of-dragon-blood"], {
  keywords: [legendary],
  abilities: () => ({
    costsLessPlayEachDraconicChainLinkControl: {
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
    gainDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-resources",
            amount: 1,
          },
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
        ],
      },
    },
  }),
});

export const { red: dropOfDragonBloodRed } = dropOfDragonBlood.cards;
