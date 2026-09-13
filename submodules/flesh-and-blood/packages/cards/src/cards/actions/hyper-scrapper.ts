import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hyper-scrapper.generated.ts";

export const hyperScrapper = definePitchFamily(fabPitchFamilies["hyper-scrapper"], {
  abilities: () => ({
    additionalCostPlayBanishXItemsGraveyard: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: {
            type: "x",
          },
          filter: {
            typeBox: {
              subtypes: ["Item"],
            },
          },
        },
      },
    },
    attacksGetsXPower3MoreHyperDriversWereBanishedPlayGainResourceResourceResourceResourceResourceResourceGetsGoAgain:
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "attack",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: {
                  type: "x",
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              {
                type: "conditional",
                condition: {
                  type: "compare-amount",
                  amount: {
                    type: "count",
                    what: "banished-this-way",
                    filter: { name: "Hyper Driver" },
                  },
                  comparison: { op: "gte", value: 3 },
                },
                then: {
                  type: "sequence",
                  steps: [
                    {
                      type: "gain-resources",
                      amount: 6,
                    },
                    {
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
                  ],
                },
              },
            ],
          },
        },
      },
  }),
});

export const { blue: hyperScrapperBlue } = hyperScrapper.cards;
