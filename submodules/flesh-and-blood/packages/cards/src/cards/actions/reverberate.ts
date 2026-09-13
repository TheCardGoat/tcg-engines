import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reverberate.generated.ts";

export const reverberate = definePitchFamily(fabPitchFamilies["reverberate"], {
  parameters: { red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } },
  abilities: ({ damage }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "opponent",
        },
      },
    },
    hasStatusThisDealtDamageOptionalBanishCountOptionalPlayCardThisTurn: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
              and: [
                {
                  typeBox: {
                    supertypes: ["Wizard"],
                  },
                },
                {
                  typeBox: {
                    excludeSubtypes: ["Attack"],
                  },
                },
              ],
              cost: {
                op: "lte",
                value: {
                  type: "count",
                  what: "damage-dealt",
                  per: "chain-link",
                },
              },
            },
            count: 1,
          },
          outputBinding: "it",
        },
        then: {
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  }),
});

export const {
  red: reverberateRed,
  yellow: reverberateYellow,
  blue: reverberateBlue,
} = reverberate.cards;
