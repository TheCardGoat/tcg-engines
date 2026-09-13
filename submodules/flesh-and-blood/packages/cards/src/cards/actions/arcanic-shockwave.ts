import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcanic-shockwave.generated.ts";

/** Model notes (hand-authored): Lightning Fusion; on-attack fused trigger deals 1 arcane to a hero. */
export const arcanicShockwave = definePitchFamily(fabPitchFamilies["arcanic-shockwave"], {
  keywords: [fusion("Lightning")],
  abilities: () => ({
    staticTriggeredAttackAttackDealDamageArcane: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
          fused: true,
        },
        state: {
          type: "has-status",
          status: "fused",
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
  red: arcanicShockwaveRed,
  yellow: arcanicShockwaveYellow,
  blue: arcanicShockwaveBlue,
} = arcanicShockwave.cards;
