import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/singeing-steelblade.generated.ts";

export const singeingSteelblade = definePitchFamily(fabPitchFamilies["singeing-steelblade"], {
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Singeing Steelblade",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
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
  red: singeingSteelbladeRed,
  yellow: singeingSteelbladeYellow,
  blue: singeingSteelbladeBlue,
} = singeingSteelblade.cards;
