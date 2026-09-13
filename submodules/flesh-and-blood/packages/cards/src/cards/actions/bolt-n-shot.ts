import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bolt-n-shot.generated.ts";

const abilities = {
  gainGoAgainAndArsenalOnHit: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "object-numeric-comparison",
      property: "power",
      left: "current",
      op: "gt",
      right: "base",
    },
    effect: {
      type: "sequence",
      steps: [
        {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "go-again",
            },
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
              id: "arsenalCardOnHit",
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
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "conditional",
                  condition: {
                    type: "and",
                    conditions: [
                      {
                        type: "zone-count",
                        zone: "arsenal",
                        player: "controller",
                        comparison: {
                          op: "eq",
                          value: 0,
                        },
                      },
                      {
                        type: "zone-count",
                        zone: "hand",
                        player: "controller",
                        comparison: {
                          op: "gte",
                          value: 1,
                        },
                      },
                    ],
                  },
                  then: {
                    type: "optional",
                    effect: {
                      type: "move-card",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["hand"],
                        count: 1,
                      },
                      to: {
                        zone: "arsenal",
                      },
                      faceDown: true,
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
      ],
    },
  },
} as const;

export const boltNShot = definePitchFamily(fabPitchFamilies["bolt-n-shot"], {
  abilities: () => abilities,
});

export const { red: boltNShotRed, yellow: boltNShotYellow, blue: boltNShotBlue } = boltNShot.cards;
