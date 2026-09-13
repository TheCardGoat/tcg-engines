import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nucleus-aetherbolt.generated.ts";

/** Model notes (hand-authored): "any target" is the opposing hero in 1v1
 * (selector any-hero, same as Zap). The follow-up packet is sourced from the
 * hero (`source: controller`) after an optional tap. */
export const nucleusAetherbolt = definePitchFamily(fabPitchFamilies["nucleus-aetherbolt"], {
  abilities: () => ({
    deal3ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "any-hero",
        },
      },
    },
    dealsDamageTapDeals1ArcaneDamageAnyTarget: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "tap",
          target: {
            selector: "controller",
          },
        },
        then: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          // Resolution-time hero choice after the optional tap is accepted.
          // any-hero is play-time; on-stack objects are gone mid-optional.
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["hero"],
            count: 1,
          },
          source: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { red: nucleusAetherboltRed } = nucleusAetherbolt.cards;
