import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcanic-crackle.generated.ts";

/** Model notes (hand-authored): printed "When this attacks" — on-attack trigger, not a resolution effect. */
export const arcanicCrackle = definePitchFamily(fabPitchFamilies["arcanic-crackle"], {
  abilities: () => ({
    staticTriggeredAttackDealDamageArcane: {
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
  red: arcanicCrackleRed,
  yellow: arcanicCrackleYellow,
  blue: arcanicCrackleBlue,
} = arcanicCrackle.cards;
