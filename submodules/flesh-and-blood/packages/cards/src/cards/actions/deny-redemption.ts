import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/deny-redemption.generated.ts";

export const denyRedemption = definePitchFamily(fabPitchFamilies["deny-redemption"], {
  abilities: () => ({
    whenAttacksHeroMoreThanDeal1ArcaneDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "more-life-than-you",
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "be-prevented",
              duration: "this-chain-link",
            },
          ],
        },
      },
    },
    instantDiscardHeroesCanTGainTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-life",
        duration: "this-turn",
      },
    },
  }),
});
export const { red: denyRedemptionRed } = denyRedemption.cards;
