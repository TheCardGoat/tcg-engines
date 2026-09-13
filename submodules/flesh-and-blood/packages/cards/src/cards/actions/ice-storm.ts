import { goAgain } from "../shared/keywords.ts";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ice-storm.generated.ts";

export const iceStorm = definePitchFamily(fabPitchFamilies["ice-storm"], {
  keywords: [fusion(["Ice", "Lightning"], "and"), goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    iceStormFusedNextArrowAttackTurnGainsHitsDeal1DamageWheneverAttackDealsDamageCreateManyFrostbiteTokens:
      {
        kind: "resolution",
        condition: {
          type: "has-status",
          status: "fused",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "hitsDeal1Damage",
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
                      type: "deal-damage",
                      damageType: "generic",
                      amount: 1,
                      target: {
                        selector: "attack-target",
                      },
                    },
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "wheneverAttackDealsDamageCreateManyFrostbiteTokens",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "dealt-damage",
                      actor: {
                        kind: "any",
                      },
                      observes: {
                        kind: "none",
                      },
                      target: {
                        kind: "hero",
                      },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "create-token",
                      token: "frostbite",
                      controller: "opponent",
                      count: {
                        type: "event-amount",
                      },
                    },
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
            },
          ],
        },
      },
  }),
});

export const { red: iceStormRed } = iceStorm.cards;
