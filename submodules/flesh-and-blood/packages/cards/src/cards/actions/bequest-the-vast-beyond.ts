import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bequest-the-vast-beyond.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bequestTheVastBeyond = definePitchFamily(fabPitchFamilies["bequest-the-vast-beyond"], {
  keywords: [
    {
      name: "specialization",
      hero: "Viserai",
    },
    goAgain,
  ],
  abilities: () => ({
    nextRunebladeAttackActionPlayTurnCostsLessPlay: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Runechant",
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Runeblade"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});
export const { red: bequestTheVastBeyondRed } = bequestTheVastBeyond.cards;
