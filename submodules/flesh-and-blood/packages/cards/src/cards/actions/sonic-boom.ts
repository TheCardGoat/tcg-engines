import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sonic-boom.generated.ts";

export const sonicBoom = definePitchFamily(fabPitchFamilies["sonic-boom"], {
  abilities: () => ({
    dealNumber3ArcaneDamageOpposingHero: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "opponent",
        },
      },
    },
    dealsDamageLookAtTopDeckSWizardNonAttackActionBanish: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                and: [
                  {
                    typeBox: {
                      types: ["Action"],
                      supertypes: ["Wizard"],
                    },
                  },
                  {
                    typeBox: {
                      excludeSubtypes: ["Attack"],
                    },
                  },
                ],
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              then: {
                type: "optional",
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "play-card",
                      fromZones: ["banished"],
                      source: {
                        selector: "binding",
                        binding: "it",
                      },
                      duration: "this-turn",
                      asType: "instant",
                    },
                    {
                      type: "modify-numeric",
                      property: "cost",
                      op: "subtract",
                      amount: {
                        type: "count",
                        what: "damage-dealt",
                        per: "chain-link",
                      },
                      target: {
                        selector: "binding",
                        binding: "it",
                      },
                      duration: "this-turn",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: sonicBoomYellow } = sonicBoom.cards;
