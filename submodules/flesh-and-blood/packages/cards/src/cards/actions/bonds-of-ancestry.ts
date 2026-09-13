import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bonds-of-ancestry.generated.ts";

import { combo, goAgain } from "../shared/keywords.ts";

const redAbilities = {
  reduceCostAfterGustwave: {
    kind: "static",
    staticKind: "play",
    condition: {
      type: "last-attack-this-combat-chain",
      nameIncludes: ["Gustwave"],
    },
    playEffect: {
      role: "cost-reduction",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
    },
    label: {
      name: "combo",
      params: {
        names: ["*Gustwave*"],
      },
    },
  },
  grantComboSearchOnAttack: {
    kind: "resolution",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-combat-chain",
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "searchComboCardOnAttack",
              text: "",
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
                      type: "optional",
                      effect: {
                        type: "banish",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["graveyard"],
                          filter: {
                            hasKeyword: "combo",
                          },
                          count: 1,
                        },
                        outputBinding: "it",
                      },
                      then: {
                        type: "search",
                        zones: ["deck"],
                        filter: {
                          name: "chosen",
                        },
                        mayFail: true,
                        to: {
                          zone: "banished",
                        },
                      },
                    },
                    {
                      type: "shuffle",
                      zone: "deck",
                    },
                    {
                      type: "optional",
                      effect: {
                        type: "play-card",
                        fromZones: ["banished"],
                        source: {
                          selector: "binding",
                          binding: "it",
                        },
                        duration: "this-combat-chain",
                      },
                    },
                  ],
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-combat-chain",
        },
      ],
    },
    label: {
      name: "combo",
      params: {
        nameIncludes: ["Gustwave"],
      },
    },
  },
} as const;

const otherAbilities = {
  reduceCostAndGrantComboSearch: {
    kind: "static",
    staticKind: "continuous",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
        {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "searchComboCardOnAttack",
                  text: "",
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
                          type: "optional",
                          effect: {
                            type: "banish",
                            target: {
                              selector: "object",
                              declared: "at-resolution",
                              player: "controller",
                              zones: ["graveyard"],
                              filter: {
                                hasKeyword: "combo",
                              },
                              count: 1,
                            },
                            outputBinding: "it",
                          },
                          then: {
                            type: "search",
                            zones: ["deck"],
                            filter: {
                              name: "chosen",
                            },
                            mayFail: true,
                            to: {
                              zone: "banished",
                            },
                          },
                        },
                        {
                          type: "shuffle",
                          zone: "deck",
                        },
                        {
                          type: "optional",
                          effect: {
                            type: "play-card",
                            fromZones: ["banished"],
                            source: {
                              selector: "binding",
                              binding: "it",
                            },
                            duration: "this-combat-chain",
                          },
                        },
                      ],
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      ],
    },
    label: {
      name: "combo",
      params: {
        nameIncludes: ["Gustwave"],
      },
    },
  },
} as const;

export const bondsOfAncestry = definePitchFamily(fabPitchFamilies["bonds-of-ancestry"], {
  keywords: pitchMap({ red: [combo], yellow: [goAgain, combo], blue: [goAgain, combo] }),
  abilities: (_, { color }) => (color === "Red" ? redAbilities : otherAbilities),
});

export const {
  red: bondsOfAncestryRed,
  yellow: bondsOfAncestryYellow,
  blue: bondsOfAncestryBlue,
} = bondsOfAncestry.cards;
