import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/annihilator-engine.generated.ts";

import { overpower } from "../shared/keywords.ts";

export const annihilatorEngine = definePitchFamily(fabPitchFamilies["annihilator-engine"], {
  keywords: [overpower],
  abilities: () => ({
    ifHave1MoreEvosEquippedGetsWhenHits: {
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
                  id: "whenHitsHeroDestroyAllDefending",
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
                      type: "destroy",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "opponent",
                        zones: ["combat-chain"],
                        filter: {
                          defending: true,
                        },
                        count: {
                          type: "all",
                        },
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
                value: 2,
              },
            },
            then: {
              type: "modify-numeric",
              property: "cost",
              op: "subtract",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "while-condition",
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
export const { red: annihilatorEngineRed } = annihilatorEngine.cards;
