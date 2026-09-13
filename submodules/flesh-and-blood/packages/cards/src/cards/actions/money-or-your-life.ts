import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/money-or-your-life.generated.ts";

export const moneyOrYourLife = definePitchFamily(fabPitchFamilies["money-or-your-life"], {
  abilities: () => ({
    triggeredHitSequenceUnlessDealDamageGainControlGoldConditionalHasStatusHeroIsThiefRepeatUnlessDealDamageGain:
      {
        kind: "static",
        staticKind: "triggered",
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
                type: "unless",
                effect: {
                  type: "deal-damage",
                  damageType: "generic",
                  amount: 2,
                  target: {
                    selector: "attack-target",
                  },
                },
                escape: {
                  type: "gain-control",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["permanent"],
                    filter: {
                      name: "Gold",
                      typeBox: {
                        metatypes: ["Token"],
                      },
                    },
                    count: 1,
                  },
                  controller: "controller",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "hero-is-thief",
                },
                then: {
                  type: "repeat",
                  effect: {
                    type: "unless",
                    effect: {
                      type: "deal-damage",
                      damageType: "generic",
                      amount: 2,
                      target: {
                        selector: "attack-target",
                      },
                    },
                    escape: {
                      type: "gain-control",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "opponent",
                        zones: ["permanent"],
                        filter: {
                          name: "Gold",
                          typeBox: {
                            metatypes: ["Token"],
                          },
                        },
                        count: 1,
                      },
                      controller: "controller",
                    },
                  },
                  times: 1,
                },
              },
            ],
          },
        },
      },
  }),
});

export const {
  red: moneyOrYourLifeRed,
  yellow: moneyOrYourLifeYellow,
  blue: moneyOrYourLifeBlue,
} = moneyOrYourLife.cards;
