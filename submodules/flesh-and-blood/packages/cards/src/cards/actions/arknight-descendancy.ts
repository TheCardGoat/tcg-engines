import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/arknight-descendancy.generated.ts";
import { bloodDebt, specialization } from "../shared/keywords.ts";

export const arknightDescendancy = definePitchFamily(fabPitchFamilies["arknight-descendancy"], {
  keywords: [specialization("Viserai"), bloodDebt],
  abilities: () => ({
    costsLessPlayEachRunechantControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: { name: "Runechant" },
        },
        target: { selector: "self" },
        duration: "while-in-arena",
      },
    },
    whenBanishedFromAnywherePayLifeCreateRunechants: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["hand", "banished", "graveyard", "deck", "arsenal", "pitch"],
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              { type: "choose-number", min: 0, max: 3 },
              {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "life",
                  amount: { type: "reference", binding: "chosen-number" },
                },
                payer: "controller",
              },
              {
                type: "create-token",
                token: "runechant",
                controller: "controller",
                count: { type: "reference", binding: "chosen-number" },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { blue: arknightDescendancyBlue } = arknightDescendancy.cards;
