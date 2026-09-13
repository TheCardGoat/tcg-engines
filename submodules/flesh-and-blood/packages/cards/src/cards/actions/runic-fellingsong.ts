import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-fellingsong.generated.ts";

export const runicFellingsong = definePitchFamily(fabPitchFamilies["runic-fellingsong"], {
  abilities: () => ({
    triggeredAttackOptionalBanishDealDamage: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            outputBinding: "banished",
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "any-hero",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: runicFellingsongRed,
  yellow: runicFellingsongYellow,
  blue: runicFellingsongBlue,
} = runicFellingsong.cards;
