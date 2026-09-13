import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/terminator-tank.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const terminatorTank = definePitchFamily(fabPitchFamilies["terminator-tank"], {
  abilities: () => ({
    haveNumber2MoreEvosEquippedCostsResourceResourceResourceLessPlay: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            subtypes: ["Evo"],
          },
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
      },
    },
    haveNumber1MoreEvosEquippedGetsWhenHitsHeroTheyDiscardNumber2: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 1,
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "whenHitsHeroTheyDiscard",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "hit",
                      actor: {
                        kind: "player",
                        player: "ability-controller",
                      },
                      observes: {
                        kind: "source",
                        selector: "attack",
                      },
                      target: {
                        kind: "hero",
                      },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "discard",
                      target: {
                        selector: "attack-target",
                      },
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 3,
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: overpower,
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
              type: "equipped-count",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              comparison: {
                op: "gte",
                value: 4,
              },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { red: terminatorTankRed } = terminatorTank.cards;
