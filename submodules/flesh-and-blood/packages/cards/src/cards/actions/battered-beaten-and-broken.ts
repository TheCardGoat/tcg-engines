import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/battered-beaten-and-broken.generated.ts";

export const batteredBeatenAndBroken = definePitchFamily(
  fabPitchFamilies["battered-beaten-and-broken"],
  {
    abilities: () => ({
      whenAttacksHeroIntimidateThem: {
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
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "intimidate",
            target: "attack-target",
          },
        },
        label: {
          name: "intimidate",
        },
      },
      ifControl3MoreAurasGets3WhenHits: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
          comparison: {
            op: "gte",
            value: 3,
          },
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
                  id: "whenHitsHeroDestroyIntimidatedTheyOwn",
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
                        player: "attack-target",
                        zones: ["banished"],
                        filter: {
                          hasStatus: "intimidated",
                        },
                        count: 1,
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
        label: {
          name: "intimidate",
        },
      },
    }),
  },
);
export const { yellow: batteredBeatenAndBrokenYellow } = batteredBeatenAndBroken.cards;
