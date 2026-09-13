import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/standing-ovation.generated.ts";

export const standingOvation = definePitchFamily(fabPitchFamilies["standing-ovation"], {
  abilities: () => ({
    number3MoreAurasSuspenseHaveLeftArenaTurnGetsWhenHitsHero: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "left-arena-count",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
          hasKeyword: "suspense",
        },
        comparison: {
          op: "gte",
          value: 3,
        },
        per: "turn",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroTakeExtraTurnAfterOneAtBeginningNextEnd",
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
                    type: "take-extra-turn",
                    player: "controller",
                  },
                  {
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "end-phase",
                        actor: {
                          kind: "any",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "this-turn",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "draw",
                        count: {
                          type: "up-to",
                          amount: {
                            type: "hero-property",
                            property: "intellect",
                            player: "controller",
                          },
                        },
                        player: "controller",
                      },
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
    },
  }),
});

export const { blue: standingOvationBlue } = standingOvation.cards;
