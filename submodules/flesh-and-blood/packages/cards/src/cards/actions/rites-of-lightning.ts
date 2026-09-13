import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rites-of-lightning.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const ritesOfLightning = definePitchFamily(fabPitchFamilies["rites-of-lightning"], {
  keywords: [fusion("Lightning"), goAgain],
  abilities: () => ({
    triggeredAttackRitesOfLightningHasStatusFusedDealDamage: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Rites Of Lightning",
            },
          },
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
    damageDealtGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: ritesOfLightningRed,
  yellow: ritesOfLightningYellow,
  blue: ritesOfLightningBlue,
} = ritesOfLightning.cards;
