import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-horror.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const shadowrealmHorror = definePitchFamily(fabPitchFamilies["shadowrealm-horror"], {
  keywords: [bloodDebt],
  abilities: () => ({
    asAdditionalCostPlayBanishNumber3RandomInGraveyard: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 3,
          random: true,
        },
      },
    },
    number1MoreWithNumber6MorePowerBanishedWayGetsNumber1PowerNumber2: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "banished-this-way",
                filter: { power: { op: "gte", value: 6 } },
              },
              comparison: { op: "gte", value: 1 },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "banished-this-way",
                filter: { power: { op: "gte", value: 6 } },
              },
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "banished-this-way",
                filter: { power: { op: "gte", value: 6 } },
              },
              comparison: { op: "gte", value: 3 },
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "banished-this-way",
                },
                duration: "this-turn",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: shadowrealmHorrorRed } = shadowrealmHorror.cards;
