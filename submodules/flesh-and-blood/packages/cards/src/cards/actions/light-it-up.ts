import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/light-it-up.generated.ts";

const equipmentTheyControl = {
  type: "count" as const,
  what: "cards-in-zone" as const,
  zone: "permanent" as const,
  player: "attack-target" as const,
  filter: { typeBox: { types: ["Equipment"] as const } },
};

export const lightItUp = definePitchFamily(fabPitchFamilies["light-it-up"], {
  keywords: [
    {
      name: "specialization",
      hero: "Lexi",
    },
    fusion("Lightning"),
  ],
  abilities: () => ({
    lightUpFusedGainsHitsDeal1DamageEquipment: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsDeal1DamageEquipment",
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
                amount: equipmentTheyControl,
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
    lightUpDealsDamageEqualGreaterThanNumberEquipmentEquipmentLoseCantGainActivatedAbilitiesEndNextTurn:
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "dealt-damage",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "damage-source",
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "conditional",
            condition: {
              type: "source-damage-dealt",
              per: "chain-link",
              toHero: true,
              comparison: {
                op: "gte",
                value: equipmentTheyControl,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "remove-property",
                  property: {
                    kind: "abilities",
                  },
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        types: ["Equipment"],
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "until-end-of-next-turn",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "gain-abilities",
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                    },
                  },
                  duration: "until-end-of-next-turn",
                },
              ],
            },
          },
        },
      },
  }),
});

export const { yellow: lightItUpYellow } = lightItUp.cards;
