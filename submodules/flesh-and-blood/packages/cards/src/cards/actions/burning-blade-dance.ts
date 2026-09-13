import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burning-blade-dance.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const burningBladeDance = definePitchFamily(fabPitchFamilies["burning-blade-dance"], {
  abilities: () => ({
    ifControl2MoreDraconicChainLinksGetsGo: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
      },
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
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroMayHaveTargetDaggerControlDeal",
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
                    type: "optional",
                    effect: {
                      type: "sequence",
                      steps: [
                        {
                          type: "deal-damage",
                          damageType: "generic",
                          amount: 1,
                          target: {
                            selector: "attack-target",
                          },
                          source: {
                            selector: "object",
                            declared: "on-stack",
                            player: "controller",
                            zones: ["permanent"],
                            filter: {
                              typeBox: {
                                subtypes: ["Dagger"],
                              },
                            },
                            count: 1,
                          },
                        },
                        {
                          type: "conditional",
                          condition: {
                            type: "binding-numeric",
                            binding: "damage-dealt-this-way",
                            comparison: { op: "gt", value: 0 },
                          },
                          then: {
                            type: "set-status",
                            status: "hit",
                            target: {
                              selector: "binding",
                              binding: "it",
                            },
                          },
                        },
                        {
                          type: "destroy",
                          target: {
                            selector: "binding",
                            binding: "it",
                          },
                        },
                      ],
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
        ],
      },
    },
  }),
});
export const { red: burningBladeDanceRed } = burningBladeDance.cards;
