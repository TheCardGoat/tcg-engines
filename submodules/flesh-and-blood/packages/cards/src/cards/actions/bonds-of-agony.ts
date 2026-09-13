import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bonds-of-agony.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const bondsOfAgony = definePitchFamily(fabPitchFamilies["bonds-of-agony"], {
  keywords: [stealth],
  abilities: () => ({
    ifVePlayedActivated3MoreAttackReactionsChain: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "attack-reactions-this-chain-link" },
        comparison: { op: "gte", value: 3 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
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
                id: "whenHitsHeroLookAtTheirHandChooseSearch",
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
                    type: "sequence",
                    steps: [
                      {
                        type: "look",
                        target: {
                          selector: "object",
                          declared: "on-stack",
                          player: "opponent",
                          zones: ["hand"],
                          count: 1,
                        },
                        outputBinding: "it",
                      },
                      {
                        type: "banish",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "opponent",
                          zones: ["hand", "deck", "graveyard"],
                          filter: {
                            name: "chosen",
                          },
                          count: {
                            type: "up-to",
                            amount: 3,
                          },
                        },
                      },
                      {
                        type: "shuffle",
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
    },
  }),
});
export const { blue: bondsOfAgonyBlue } = bondsOfAgony.cards;
