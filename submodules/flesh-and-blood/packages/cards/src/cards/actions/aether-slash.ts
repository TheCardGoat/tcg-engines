import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-slash.generated.ts";

export const aetherSlash = definePitchFamily(fabPitchFamilies["aether-slash"], {
  // Printed: "When Aether Slash attacks, if a 'non-attack' action card was
  // pitched to play it, deal 1 arcane damage to any target." — attack-event
  // trigger gated by the pitch status (arcanic-shockwave fused pattern).
  abilities: () => ({
    staticTriggeredAttackPitchedNonAttackDealDamageArcane: {
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
        },
        state: {
          type: "has-status",
          status: "pitched-non-attack-action-card-to-play-this",
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
  red: aetherSlashRed,
  yellow: aetherSlashYellow,
  blue: aetherSlashBlue,
} = aetherSlash.cards;
