import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/weeping-battleground.generated.ts";

export const weepingBattleground = definePitchFamily(fabPitchFamilies["weeping-battleground"], {
  abilities: () => ({
    banishAuraToDealArcaneDamage: {
      kind: "resolution",
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
  }),
});

export const {
  red: weepingBattlegroundRed,
  yellow: weepingBattlegroundYellow,
  blue: weepingBattlegroundBlue,
} = weepingBattleground.cards;
